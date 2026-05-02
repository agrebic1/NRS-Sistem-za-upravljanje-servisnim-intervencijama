const { zahtjevShema } = require('@/lib/validations/requestValidation');

const validPayload = {
  naslov: 'Neispravan prekidac',
  idKategorije: 1,
  opis: 'Prekidac u hodniku varnici i ne radi ispravno.',
  lokacija: 'Zmaja od Bosne 1',
  telefon: '+38761111222',
  zeljenoVrijeme: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  napomena: 'Molim poziv prije dolaska.',
};

describe('requestValidation', () => {
  test('accepts valid payload', () => {
    expect(zahtjevShema.safeParse(validPayload).success).toBe(true);
  });

  test('rejects invalid category and past date', () => {
    const invalidCategory = zahtjevShema.safeParse({ ...validPayload, idKategorije: 0 });
    const pastDate = zahtjevShema.safeParse({
      ...validPayload,
      zeljenoVrijeme: '2000-01-01T10:00:00.000Z',
    });
    expect(invalidCategory.success).toBe(false);
    expect(pastDate.success).toBe(false);
  });

  test('enforces title and description bounds', () => {
    expect(zahtjevShema.safeParse({ ...validPayload, naslov: 'abc' }).success).toBe(false);
    expect(zahtjevShema.safeParse({ ...validPayload, opis: 'x'.repeat(1001) }).success).toBe(false);
  });
});
