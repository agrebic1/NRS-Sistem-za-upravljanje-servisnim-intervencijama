const {
  operativnaGrupaIzFinalnogPrioriteta,
  rangOperativnogPrioriteta,
} = require('@/lib/servisirane/operativniPrioritet');

describe('operativni prioritet dispecera', () => {
  test.each([
    ['HITNO', 'Hitno', 0],
    ['KRITIČNO', 'Hitno', 0],
    ['VISOKO', 'Hitno', 0],
    ['SREDNJE', 'Srednja', 1],
    ['NISKO', 'Niska', 2],
  ])('mapira %s u operativnu grupu %s', (prioritet, grupa, rang) => {
    expect(operativnaGrupaIzFinalnogPrioriteta(prioritet)).toBe(grupa);
    expect(rangOperativnogPrioriteta(prioritet)).toBe(rang);
  });

  test('prazan ili nepoznat prioritet tretira kao srednju grupu', () => {
    expect(operativnaGrupaIzFinalnogPrioriteta(null)).toBe('Srednja');
    expect(operativnaGrupaIzFinalnogPrioriteta('')).toBe('Srednja');
    expect(operativnaGrupaIzFinalnogPrioriteta('nepoznato')).toBe('Srednja');
    expect(rangOperativnogPrioriteta(undefined)).toBe(1);
  });

  test('normalizuje razmake i velika slova prije mapiranja', () => {
    expect(operativnaGrupaIzFinalnogPrioriteta('  visoko ')).toBe('Hitno');
    expect(operativnaGrupaIzFinalnogPrioriteta('  nisko ')).toBe('Niska');
  });
});
