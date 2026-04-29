const { AuthServis } = require('@/lib/services/authServis');
const { resetLoginRateLimitStore } = require('@/lib/security/loginRateLimiter');

describe('AuthServis login rate limit integration', () => {
  beforeEach(() => {
    resetLoginRateLimitStore();
  });

  test('returns rate-limit error after too many failed logins', async () => {
    const repo = {
      prijaviKorisnika: jest.fn().mockResolvedValue({ greska: 'Invalid login credentials' }),
      registrujKorisnika: jest.fn(),
      odjaviKorisnika: jest.fn(),
    };
    const servis = new AuthServis(repo);

    for (let i = 0; i < 5; i += 1) {
      const result = await servis.prijava({ email: 'limit@example.com', lozinka: 'abcdef' });
      expect(result.greska).toBe('Invalid login credentials');
    }

    const blocked = await servis.prijava({ email: 'limit@example.com', lozinka: 'abcdef' });
    expect(blocked.greska).toBe('Previše pokušaja prijave. Sačekajte 5 minuta i pokušajte ponovo.');
    expect(repo.prijaviKorisnika).toHaveBeenCalledTimes(5);
  });
});
