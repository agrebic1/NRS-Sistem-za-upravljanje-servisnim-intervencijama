const mockSignInWithPassword = jest.fn();
const mockResend = jest.fn();
const mockSignUp = jest.fn();
const mockSignOut = jest.fn();
const mockGetUser = jest.fn();
const mockFrom = jest.fn();

jest.mock('@/lib/supabase/klijent', () => ({
  kreirajKlijenta: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      resend: mockResend,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getUser: mockGetUser,
    },
    from: mockFrom,
  }),
}));

const {
  getUlogeKorisnika,
  odrediRedirectNakonPrijave,
  posaljiPonovoVerifikacijskiEmail,
  prijaviSeEmailom,
  registrujKorisnika,
  odjaviSe,
  getTrenutnogKorisnika,
} = require('@/services/auth/authService');
const { resetLoginRateLimitStore } = require('@/lib/security/loginRateLimiter');

function builder(result) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue(result),
    single: jest.fn().mockResolvedValue(result),
  };
}

describe('auth service role logic and auth flows', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    resetLoginRateLimitStore();
    mockFrom.mockReset();
    mockSignInWithPassword.mockReset();
    mockResend.mockReset();
    mockSignUp.mockReset();
    mockSignOut.mockReset();
    mockGetUser.mockReset();
  });

  test('login maps specific and generic auth errors', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Email not confirmed' },
    });
    await expect(prijaviSeEmailom({ email: 'user@example.com', lozinka: 'x' })).rejects.toThrow(
      'Email adresa nije potvrđena'
    );

    mockSignInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid login credentials' },
    });
    await expect(prijaviSeEmailom({ email: 'user@example.com', lozinka: 'x' })).rejects.toThrow(
      'Pogrešna email adresa ili lozinka'
    );

    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: { id: 'u1' } },
      error: null,
    });
    await expect(prijaviSeEmailom({ email: ' USER@EXAMPLE.COM ', lozinka: 'x' })).resolves.toEqual({
      user: { id: 'u1' },
    });
  });

  test('resend verification validates email', async () => {
    await expect(posaljiPonovoVerifikacijskiEmail('los-email')).rejects.toThrow(
      'Unesite ispravnu email adresu.'
    );
    mockResend.mockResolvedValue({ error: null });
    await expect(posaljiPonovoVerifikacijskiEmail(' User@Example.Com ')).resolves.toBeUndefined();
    mockResend.mockResolvedValue({ error: { message: 'fail' } });
    await expect(posaljiPonovoVerifikacijskiEmail('user@example.com')).rejects.toThrow(
      'Slanje verifikacijskog emaila nije uspjelo'
    );
  });

  test('registration maps errors and succeeds', async () => {
    await expect(
      registrujKorisnika({
        ime: 'A',
        prezime: 'B',
        email: 'bad-email',
        telefon: '061111222',
        lozinka: 'Abcd123!',
      })
    ).rejects.toThrow('Unesite ispravnu email adresu.');

    mockSignUp.mockResolvedValueOnce({
      data: null,
      error: { message: 'Too many requests', status: 429 },
    });
    await expect(
      registrujKorisnika({
        ime: 'A',
        prezime: 'B',
        email: 'user@example.com',
        telefon: '061111222',
        lozinka: 'Abcd123!',
      })
    ).rejects.toThrow('Previše pokušaja registracije');

    mockSignUp.mockResolvedValueOnce({
      data: null,
      error: { message: 'Unexpected auth error', status: 400 },
    });
    await expect(
      registrujKorisnika({
        ime: 'A',
        prezime: 'B',
        email: 'user@example.com',
        telefon: '061111222',
        lozinka: 'Abcd123!',
      })
    ).rejects.toThrow('Unexpected auth error');

    mockSignUp.mockResolvedValueOnce({
      data: {},
      error: null,
    });
    await expect(
      registrujKorisnika({
        ime: 'A',
        prezime: 'B',
        email: 'user@example.com',
        telefon: '061111222',
        lozinka: 'Abcd123!',
      })
    ).rejects.toThrow('Kreiranje naloga nije uspjelo');

    const osobaUpdate = builder({ data: null });
    mockFrom.mockImplementation((table) => {
      if (table === 'osoba') return osobaUpdate;
      return builder({ data: null });
    });
    mockSignUp.mockResolvedValueOnce({
      data: { user: { id: 'id-1' } },
      error: null,
    });
    await expect(
      registrujKorisnika({
        ime: 'A',
        prezime: 'B',
        email: ' USER@EXAMPLE.COM ',
        telefon: '061111222',
        lozinka: 'Abcd123!',
      })
    ).resolves.toEqual({ user: { id: 'id-1' } });
  });

  test('maps roles and redirects', async () => {
    global.fetch.mockRejectedValue(new Error('offline'));
    mockFrom.mockImplementation((table) => {
      if (table === 'korisnik_usluge') return builder({ data: { id_korisnika_usluge: 'u1' } });
      if (table === 'uposlenici') return builder({ data: { id_uloge: 2 } });
      if (table === 'uloga') return builder({ data: { naziv: 'Dispecer' } });
      return builder({ data: null });
    });
    const roles = await getUlogeKorisnika('u1');
    expect(roles).toEqual(expect.arrayContaining(['korisnik', 'dispecer']));

    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ uloge: ['korisnik'] }) });
    await expect(odrediRedirectNakonPrijave('u1')).resolves.toBe('/korisnik');

    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ uloge: ['admin', 'serviser'] }) });
    await expect(odrediRedirectNakonPrijave('u1')).resolves.toBe('/odabir-uloge');

    global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    mockFrom.mockImplementation((table) => {
      if (table === 'korisnik_usluge') return builder({ data: null });
      if (table === 'uposlenici') return builder({ data: { id_uloge: 2 } });
      if (table === 'uloga') return builder({ data: { naziv: 'X-unknown' } });
      return builder({ data: null });
    });
    await expect(getUlogeKorisnika('u2')).resolves.toEqual([]);

    global.fetch.mockRejectedValue(new Error('offline'));
    mockFrom.mockImplementation((table) => {
      if (table === 'korisnik_usluge') return builder({ data: null });
      if (table === 'uposlenici') return builder({ data: { id_uloge: 3 } });
      if (table === 'uloga') return builder({ data: { naziv: 'Serviser' } });
      return builder({ data: null });
    });
    await expect(getUlogeKorisnika('u3')).resolves.toEqual(['serviser']);

    global.fetch.mockRejectedValue(new Error('offline'));
    mockFrom.mockImplementation((table) => {
      if (table === 'korisnik_usluge') return builder({ data: null });
      if (table === 'uposlenici') return builder({ data: { id_uloge: 4 } });
      if (table === 'uloga') return builder({ data: { naziv: 'Admin' } });
      return builder({ data: null });
    });
    await expect(getUlogeKorisnika('u4')).resolves.toEqual(['admin']);

    global.fetch.mockRejectedValue(new Error('offline'));
    mockFrom.mockImplementation((table) => {
      if (table === 'korisnik_usluge') return builder({ data: null });
      if (table === 'uposlenici') return builder({ data: { id_uloge: 5 } });
      if (table === 'uloga') return builder({ data: { naziv: 'Korisnik usluge' } });
      return builder({ data: null });
    });
    await expect(getUlogeKorisnika('u5')).resolves.toEqual([]);
  });

  test('session helpers work', async () => {
    mockSignOut.mockResolvedValueOnce({ error: { message: 'x' } });
    await expect(odjaviSe()).rejects.toThrow('Greška pri odjavi iz sistema');
    mockSignOut.mockResolvedValueOnce({ error: null });
    await expect(odjaviSe()).resolves.toBeUndefined();

    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'u5' } } });
    await expect(getTrenutnogKorisnika()).resolves.toEqual({ id: 'u5' });
  });

  test('blocks login after too many failed attempts', async () => {
    for (let i = 0; i < 5; i += 1) {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid login credentials' },
      });
      await expect(prijaviSeEmailom({ email: 'limit@example.com', lozinka: 'x' })).rejects.toThrow(
        'Pogrešna email adresa ili lozinka'
      );
    }

    await expect(prijaviSeEmailom({ email: 'limit@example.com', lozinka: 'x' })).rejects.toThrow(
      'Previše pokušaja prijave. Sačekajte 5 minuta i pokušajte ponovo.'
    );
    expect(mockSignInWithPassword).toHaveBeenCalledTimes(5);
  });
});
