/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceRequestForm } from '@/components/forms/ServiceRequestForm';

const mockPosaljiZahtjev = jest.fn();
const mockGetKategorije = jest.fn();

jest.mock('@/services/zahtjevi/zahtjeviService', () => ({
  posaljiZahtjev: (...args) => mockPosaljiZahtjev(...args),
  getKategorijeKvara: (...args) => mockGetKategorije(...args),
}));

function renderWithQuery(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

async function popuniValidnuFormu(user) {
  await user.type(screen.getByLabelText('Naslov problema'), 'Elektricni kvar');
  await user.selectOptions(screen.getByLabelText('Kategorija kvara'), '1');
  await user.type(screen.getByLabelText('Opis problema'), 'Detaljan opis kvara u dnevnoj sobi.');
  await user.type(screen.getByLabelText('Adresa'), 'Ulica 1, Sarajevo');
  await user.type(screen.getByLabelText('Kontakt telefon'), '+38761111222');
}

describe('ServiceRequestForm', () => {
  beforeEach(() => {
    mockPosaljiZahtjev.mockReset();
    mockGetKategorije.mockReset();
  });

  test('successful submit shows success state', async () => {
    const user = userEvent.setup();
    mockGetKategorije.mockResolvedValue([{ id_kategorije_kvara: 1, naziv: 'Elektrika' }]);
    mockPosaljiZahtjev.mockResolvedValue({ id_zahtjeva: 1 });
    renderWithQuery(<ServiceRequestForm idKorisnika="user-1" />);

    await screen.findByRole('option', { name: 'Elektrika' });
    await popuniValidnuFormu(user);
    await user.click(screen.getByRole('button', { name: 'Pošalji zahtjev' }));

    await waitFor(() =>
      expect(mockPosaljiZahtjev).toHaveBeenCalledWith(
        expect.objectContaining({
          naslov: 'Elektricni kvar',
          idKategorije: 1,
        }),
        'user-1'
      )
    );
    expect(await screen.findByText(/Zahtjev je uspješno poslan/i)).toBeInTheDocument();
  });

  test('shows error when submit fails', async () => {
    const user = userEvent.setup();
    mockGetKategorije.mockResolvedValue([{ id_kategorije_kvara: 1, naziv: 'Elektrika' }]);
    mockPosaljiZahtjev.mockRejectedValue(new Error('Greška pri slanju zahtjeva. Pokušajte ponovo.'));
    renderWithQuery(<ServiceRequestForm idKorisnika="user-1" />);

    await screen.findByRole('option', { name: 'Elektrika' });
    await popuniValidnuFormu(user);
    await user.click(screen.getByRole('button', { name: 'Pošalji zahtjev' }));

    expect(await screen.findByText('Greška pri slanju zahtjeva. Pokušajte ponovo.')).toBeInTheDocument();
  });

  test('shows loading fallback while categories are loading', () => {
    mockGetKategorije.mockImplementation(() => new Promise(() => {}));
    renderWithQuery(<ServiceRequestForm idKorisnika="user-1" />);

    const select = screen.getByLabelText('Kategorija kvara');
    expect(select).toBeDisabled();
    expect(screen.getByRole('option', { name: 'Učitavanje...' })).toBeInTheDocument();
  });
});
