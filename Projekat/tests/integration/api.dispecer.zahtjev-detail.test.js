const mockSessionGetUser = jest.fn();
const mockFrom = jest.fn();
const mockAssertDispatcherAccess = jest.fn();

jest.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: { getUser: mockSessionGetUser },
  }),
}));

jest.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: mockFrom,
  }),
}));

jest.mock('@/lib/servisirane/dispecerPristup', () => ({
  assertDispatcherAccess: (...args) => mockAssertDispatcherAccess(...args),
}));

const { GET, PATCH } = require('@/app/api/dispecer/zahtjevi/[id]/route');

function singleQuery(result) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(result),
  };
}

function maybeSingleQuery(result) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue(result),
  };
}

function updateQuery(result = { error: null }, onUpdate = jest.fn()) {
  return {
    update: jest.fn((payload) => {
      onUpdate(payload);
      return {
        eq: jest.fn().mockResolvedValue(result),
      };
    }),
  };
}

function jsonRequest(body) {
  return new Request('http://localhost/api/dispecer/zahtjevi/1', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

describe('/api/dispecer/zahtjevi/[id] route', () => {
  beforeEach(() => {
    mockSessionGetUser.mockReset();
    mockFrom.mockReset();
    mockAssertDispatcherAccess.mockReset();
  });

  test('GET returns 401 without session', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: null } });

    const response = await GET(new Request('http://localhost/api/dispecer/zahtjevi/1'), {
      params: { id: '1' },
    });

    expect(response.status).toBe(401);
  });

  test('GET returns 400 for invalid request id', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'd1' } } });

    const response = await GET(new Request('http://localhost/api/dispecer/zahtjevi/x'), {
      params: { id: 'x' },
    });

    expect(response.status).toBe(400);
  });

  test('GET returns 403 when dispatcher access is missing', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockAssertDispatcherAccess.mockResolvedValue(false);

    const response = await GET(new Request('http://localhost/api/dispecer/zahtjevi/1'), {
      params: { id: '1' },
    });

    expect(response.status).toBe(403);
  });

  test('GET returns request detail with requester profile', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'd1' } } });
    mockAssertDispatcherAccess.mockResolvedValue(true);

    mockFrom.mockImplementation((table) => {
      if (table === 'service_requests') {
        return singleQuery({
          data: { id: 1, user_id: 'u1', status: 'pending_review' },
          error: null,
        });
      }
      if (table === 'osoba') {
        return maybeSingleQuery({
          data: { ime: 'Ajla', prezime: 'Test', broj_telefona: '061111111' },
          error: null,
        });
      }
      return singleQuery({ data: null, error: null });
    });

    const response = await GET(new Request('http://localhost/api/dispecer/zahtjevi/1'), {
      params: { id: '1' },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.zahtjev.podnosilac).toEqual({
      ime: 'Ajla',
      prezime: 'Test',
      broj_telefona: '061111111',
    });
  });

  test('PATCH confirms request and stores operational priority', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'd1' } } });
    mockAssertDispatcherAccess.mockResolvedValue(true);

    const onUpdate = jest.fn();
    let serviceCalls = 0;
    mockFrom.mockImplementation((table) => {
      if (table !== 'service_requests') return singleQuery({ data: null, error: null });
      serviceCalls += 1;
      if (serviceCalls === 1) {
        return singleQuery({ data: { status: 'pending_review', is_premium: false }, error: null });
      }
      return updateQuery({ error: null }, onUpdate);
    });

    const response = await PATCH(jsonRequest({ action: 'potvrdi', final_priority: 'VISOKO' }), {
      params: { id: '1' },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.novi_status).toBe('potvrdeno');
    expect(onUpdate).toHaveBeenCalledWith({
      status: 'potvrdeno',
      final_priority: 'VISOKO',
      premium_priority_override_reason: null,
    });
  });

  test('PATCH blocks premium downgrade without reason', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'd1' } } });
    mockAssertDispatcherAccess.mockResolvedValue(true);

    mockFrom.mockImplementation((table) => {
      if (table === 'service_requests') {
        return singleQuery({ data: { status: 'pending_review', is_premium: true }, error: null });
      }
      return singleQuery({ data: null, error: null });
    });

    const response = await PATCH(jsonRequest({ action: 'potvrdi', final_priority: 'SREDNJE' }), {
      params: { id: '1' },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('Premium zahtjev');
  });

  test('PATCH changes priority and moves new request into review', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'd1' } } });
    mockAssertDispatcherAccess.mockResolvedValue(true);

    const onUpdate = jest.fn();
    let serviceCalls = 0;
    mockFrom.mockImplementation((table) => {
      if (table !== 'service_requests') return singleQuery({ data: null, error: null });
      serviceCalls += 1;
      if (serviceCalls === 1) {
        return singleQuery({ data: { status: 'na_cekanju', is_premium: false }, error: null });
      }
      return updateQuery({ error: null }, onUpdate);
    });

    const response = await PATCH(
      jsonRequest({ action: 'promijeni_prioritet', final_priority: 'SREDNJE' }),
      { params: { id: '1' } },
    );

    expect(response.status).toBe(200);
    expect(onUpdate).toHaveBeenCalledWith({
      final_priority: 'SREDNJE',
      premium_priority_override_reason: null,
      status: 'in_review',
    });
  });

  test('PATCH blocks priority change in terminal status', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'd1' } } });
    mockAssertDispatcherAccess.mockResolvedValue(true);

    mockFrom.mockImplementation((table) => {
      if (table === 'service_requests') {
        return singleQuery({ data: { status: 'otkazano', is_premium: false }, error: null });
      }
      return singleQuery({ data: null, error: null });
    });

    const response = await PATCH(
      jsonRequest({ action: 'promijeni_prioritet', final_priority: 'NISKO' }),
      { params: { id: '1' } },
    );

    expect(response.status).toBe(400);
  });

  test('PATCH rejects request with required rejection reason', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'd1' } } });
    mockAssertDispatcherAccess.mockResolvedValue(true);

    const onUpdate = jest.fn();
    let serviceCalls = 0;
    mockFrom.mockImplementation((table) => {
      if (table !== 'service_requests') return singleQuery({ data: null, error: null });
      serviceCalls += 1;
      if (serviceCalls === 1) {
        return singleQuery({ data: { status: 'in_review', is_premium: false }, error: null });
      }
      return updateQuery({ error: null }, onUpdate);
    });

    const response = await PATCH(
      jsonRequest({ action: 'odbij', rejection_reason: 'Kvar nije u podrzanoj kategoriji.' }),
      { params: { id: '1' } },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.novi_status).toBe('odbijeno');
    expect(onUpdate).toHaveBeenCalledWith({
      status: 'odbijeno',
      rejection_reason: 'Kvar nije u podrzanoj kategoriji.',
    });
  });
});
