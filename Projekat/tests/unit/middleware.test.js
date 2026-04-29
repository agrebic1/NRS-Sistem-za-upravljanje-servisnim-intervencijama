const mockGetUser = jest.fn();
const mockRpc = jest.fn();
const mockMaybeSingle = jest.fn();
const mockEq = jest.fn(() => ({ maybeSingle: mockMaybeSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

const mockNext = jest.fn((payload) => ({
  type: 'next',
  payload,
  cookies: { set: jest.fn() },
}));
const mockRedirect = jest.fn((url) => ({ type: 'redirect', url: url.toString() }));

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: { getUser: mockGetUser },
    rpc: mockRpc,
    from: mockFrom,
  })),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    next: (...args) => mockNext(...args),
    redirect: (...args) => mockRedirect(...args),
  },
}));

const { middleware } = require('@/middleware');

function req(pathname) {
  return {
    nextUrl: { pathname },
    url: `http://localhost:3000${pathname}`,
    cookies: {
      getAll: jest.fn(() => []),
      set: jest.fn(),
    },
  };
}

describe('middleware auth and role checks', () => {
  const oldUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const oldKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://sb.local';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    mockGetUser.mockReset();
    mockRpc.mockReset();
    mockMaybeSingle.mockReset();
    mockEq.mockClear();
    mockSelect.mockClear();
    mockFrom.mockClear();
    mockNext.mockClear();
    mockRedirect.mockClear();
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = oldUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = oldKey;
  });

  test('redirects unauthenticated user to login on private route', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const response = await middleware(req('/korisnik/dashboard'));

    expect(response.type).toBe('redirect');
    expect(response.url).toContain('/auth/login');
    expect(response.url).toContain('redirectTo=%2Fkorisnik%2Fdashboard');
  });

  test.each([
    ['/admin', 'is_admin'],
    ['/serviser', 'is_serviser'],
    ['/dispecer', 'is_dispecer'],
  ])('redirects on role mismatch for %s', async (prefix, rpcName) => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockRpc.mockResolvedValue({ data: false, error: null });

    const response = await middleware(req(`${prefix}/dashboard`));

    expect(mockRpc).toHaveBeenCalledWith(rpcName);
    expect(response.type).toBe('redirect');
    expect(response.url).toBe('http://localhost:3000/');
  });

  test('redirects korisnik route when korisnik_usluge row missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const response = await middleware(req('/korisnik/dashboard'));

    expect(mockFrom).toHaveBeenCalledWith('korisnik_usluge');
    expect(response.type).toBe('redirect');
    expect(response.url).toBe('http://localhost:3000/');
  });

  test.each([
    ['/admin', () => mockRpc.mockResolvedValue({ data: true, error: null })],
    ['/serviser', () => mockRpc.mockResolvedValue({ data: true, error: null })],
    ['/dispecer', () => mockRpc.mockResolvedValue({ data: true, error: null })],
    ['/korisnik', () => mockMaybeSingle.mockResolvedValue({ data: { id_korisnika_usluge: 'u1' }, error: null })],
  ])('allows pass-through for valid role at %s', async (prefix, arrange) => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    arrange();

    const response = await middleware(req(`${prefix}/dashboard`));

    expect(response.type).toBe('next');
  });

  test('falls back to NextResponse.next when env vars are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await middleware(req('/admin'));

    expect(response.type).toBe('next');
    expect(mockGetUser).not.toHaveBeenCalled();
  });
});
