const mockSessionGetUser = jest.fn();
const mockFrom = jest.fn();
const mockListUsers = jest.fn();

jest.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: { getUser: mockSessionGetUser },
  }),
}));

jest.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: mockFrom,
    auth: { admin: { listUsers: mockListUsers } },
  }),
}));

const { GET } = require('@/app/api/admin/users/route');

function maybeSingle(result) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue(result),
  };
}

function selectOnly(result) {
  return {
    select: jest.fn().mockResolvedValue(result),
  };
}

describe('/api/admin/users route', () => {
  beforeEach(() => {
    mockFrom.mockReset();
    mockListUsers.mockReset();
    mockSessionGetUser.mockReset();
  });

  test('returns 401 when no session', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: null } });
    const response = await GET();
    expect(response.status).toBe(401);
  });

  test('returns 403 when user is not admin', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockFrom.mockImplementation((table) => {
      if (table === 'uposlenici') return maybeSingle({ data: null, error: null });
      return maybeSingle({ data: null, error: null });
    });
    const response = await GET();
    expect(response.status).toBe(403);
  });

  test('returns 200 with users for admin', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

    const ulogaLookup = {
      select: jest.fn().mockImplementation((query) => {
        if (query === 'naziv') {
          return {
            eq: jest.fn().mockReturnValue({
              maybeSingle: jest.fn().mockResolvedValue({ data: { naziv: 'Administrator' }, error: null }),
            }),
          };
        }
        return Promise.resolve({ data: [{ id_uloge: 2, naziv: 'Serviser' }], error: null });
      }),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
    };

    mockFrom.mockImplementation((table) => {
      if (table === 'uposlenici') {
        return maybeSingle({ data: { id_uloge: 1 }, error: null });
      }
      if (table === 'uloga') {
        return ulogaLookup;
      }
      if (table === 'v_korisnik_usluge') {
        return selectOnly({
          data: [{ id_korisnika_usluge: 'k1', ime: 'K', prezime: 'U', email: 'k@example.com' }],
          error: null,
        });
      }
      if (table === 'v_uposlenici') {
        return selectOnly({
          data: [{ id_uposlenika: 'u2', id_uloge: 2, ime: 'A', prezime: 'B', email: 'a@example.com' }],
          error: null,
        });
      }
      return selectOnly({ data: [], error: null });
    });

    mockListUsers.mockResolvedValue({
      data: {
        users: [
          {
            id: 'k1',
            email: 'k@example.com',
            created_at: '2026-01-01T00:00:00.000Z',
            user_metadata: {},
            email_confirmed_at: '2026-01-02T00:00:00.000Z',
          },
          {
            id: 'k2',
            email: null,
            created_at: null,
            user_metadata: {},
            confirmed_at: null,
            banned_until: '2999-01-01T00:00:00.000Z',
          },
          {
            id: 'k3',
            email: 'k3@example.com',
            created_at: '2026-01-03T00:00:00.000Z',
            user_metadata: {},
            confirmed_at: null,
            email_confirmed_at: null,
            banned_until: null,
          },
        ],
      },
      error: null,
    });

    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.some((u) => u.status === 'aktivan')).toBe(true);
    expect(body.users.some((u) => u.status === 'suspendovan')).toBe(true);
    expect(body.users.some((u) => u.status === 'neaktivan')).toBe(true);
  });

  test('returns 500 when listUsers fails', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockFrom.mockImplementation((table) => {
      if (table === 'uposlenici') return maybeSingle({ data: { id_uloge: 1 }, error: null });
      if (table === 'uloga') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              maybeSingle: jest.fn().mockResolvedValue({ data: { naziv: 'admin' }, error: null }),
            }),
          }),
        };
      }
      return selectOnly({ data: [], error: null });
    });
    mockListUsers.mockResolvedValue({ data: null, error: { message: 'auth failed' } });
    const response = await GET();
    expect(response.status).toBe(500);
  });

  test('returns 500 for table read failures and catch fallback', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockFrom.mockImplementation((table) => {
      if (table === 'uposlenici') return maybeSingle({ data: null, error: { message: 'db uposlenici' } });
      return maybeSingle({ data: null, error: null });
    });
    const r1 = await GET();
    expect(r1.status).toBe(403);

    mockFrom.mockImplementation((table) => {
      if (table === 'uposlenici') return maybeSingle({ data: { id_uloge: 1 }, error: null });
      if (table === 'uloga') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              maybeSingle: jest.fn().mockResolvedValue({ data: { naziv: 'Administrator' }, error: null }),
            }),
          }),
        };
      }
      if (table === 'v_korisnik_usluge') return selectOnly({ data: null, error: { message: 'korisnici err' } });
      if (table === 'v_uposlenici') return selectOnly({ data: [], error: null });
      return selectOnly({ data: [], error: null });
    });
    mockListUsers.mockResolvedValue({ data: { users: [] }, error: null });
    const r2 = await GET();
    expect(r2.status).toBe(500);

    mockSessionGetUser.mockRejectedValue(new Error('boom'));
    const r3 = await GET();
    expect(r3.status).toBe(500);
  });

  test('returns 500 for uposlenici/uloge errors after admin check', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockFrom.mockImplementation((table) => {
      if (table === 'uposlenici') return maybeSingle({ data: { id_uloge: 1 }, error: null });
      if (table === 'uloga') {
        return {
          select: jest.fn().mockImplementation((query) => {
            if (query === 'naziv') {
              return {
                eq: jest.fn().mockReturnValue({
                  maybeSingle: jest.fn().mockResolvedValue({ data: { naziv: 'Administrator' }, error: null }),
                }),
              };
            }
            return Promise.resolve({ data: null, error: { message: 'uloge table fail' } });
          }),
        };
      }
      if (table === 'v_korisnik_usluge') return selectOnly({ data: [], error: null });
      if (table === 'v_uposlenici') return selectOnly({ data: null, error: { message: 'uposlenici table fail' } });
      return selectOnly({ data: [], error: null });
    });
    mockListUsers.mockResolvedValue({ data: { users: [] }, error: null });
    const response = await GET();
    expect(response.status).toBe(500);
  });

  test('returns 500 when uloge query in Promise.all fails', async () => {
    mockSessionGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockFrom.mockImplementation((table) => {
      if (table === 'uposlenici') return maybeSingle({ data: { id_uloge: 1 }, error: null });
      if (table === 'uloga') {
        return {
          select: jest.fn().mockImplementation((query) => {
            if (query === 'naziv') {
              return {
                eq: jest.fn().mockReturnValue({
                  maybeSingle: jest.fn().mockResolvedValue({ data: { naziv: 'Administrator' }, error: null }),
                }),
              };
            }
            return Promise.resolve({ data: null, error: { message: 'uloge fail' } });
          }),
        };
      }
      if (table === 'v_korisnik_usluge') return selectOnly({ data: [], error: null });
      if (table === 'v_uposlenici') return selectOnly({ data: [], error: null });
      return selectOnly({ data: [], error: null });
    });
    mockListUsers.mockResolvedValue({ data: { users: [] }, error: null });
    const response = await GET();
    expect(response.status).toBe(500);
  });
});
