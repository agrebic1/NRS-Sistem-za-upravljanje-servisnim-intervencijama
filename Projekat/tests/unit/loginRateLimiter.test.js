const {
  recordFailedLoginAttempt,
  isLoginBlocked,
  clearLoginRateLimit,
  resetLoginRateLimitStore,
  getLoginRateLimitConfig,
} = require('@/lib/security/loginRateLimiter');

describe('loginRateLimiter', () => {
  beforeEach(() => {
    resetLoginRateLimitStore();
  });

  test('blocks after max failed attempts, then unblocks after block duration', () => {
    const { maxPokusaja, blokadaMs } = getLoginRateLimitConfig();
    const email = 'limit-expiry@example.com';
    const start = 1_700_000_000_000;
    const trenutakBlokade = start + (maxPokusaja - 1);

    for (let i = 0; i < maxPokusaja; i += 1) {
      recordFailedLoginAttempt(email, start + i);
    }

    expect(isLoginBlocked(email, start + maxPokusaja)).toBe(true);
    expect(isLoginBlocked(email, trenutakBlokade + blokadaMs - 1)).toBe(true);
    expect(isLoginBlocked(email, trenutakBlokade + blokadaMs + 1)).toBe(false);
  });

  test('clearLoginRateLimit removes blocked state immediately', () => {
    const email = 'clear@example.com';
    const start = 1_700_000_010_000;
    const { maxPokusaja } = getLoginRateLimitConfig();

    for (let i = 0; i < maxPokusaja; i += 1) {
      recordFailedLoginAttempt(email, start + i);
    }
    expect(isLoginBlocked(email, start + maxPokusaja)).toBe(true);

    clearLoginRateLimit(email);
    expect(isLoginBlocked(email, start + maxPokusaja)).toBe(false);
  });
});
