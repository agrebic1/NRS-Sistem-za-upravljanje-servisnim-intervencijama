/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/forms/LoginForm';

const mockPush = jest.fn();
const mockPrijava = jest.fn();
const mockRedirect = jest.fn();
const mockResend = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/link', () => {
  return function MockedLink({ children, href }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('@/services/auth/authService', () => ({
  prijaviSeEmailom: (...args) => mockPrijava(...args),
  odrediRedirectNakonPrijave: (...args) => mockRedirect(...args),
  posaljiPonovoVerifikacijskiEmail: (...args) => mockResend(...args),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockPrijava.mockReset();
    mockRedirect.mockReset();
    mockResend.mockReset();
  });

  test('submits happy path and redirects user', async () => {
    const user = userEvent.setup();
    mockPrijava.mockResolvedValue({ user: { id: 'u1' } });
    mockRedirect.mockResolvedValue('/korisnik');
    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email adresa'), 'user@example.com');
    await user.type(screen.getByLabelText('Lozinka'), 'Abcd123!');
    await user.click(screen.getByRole('button', { name: 'Prijavi se' }));

    await waitFor(() => {
      expect(mockPrijava).toHaveBeenCalledWith({
        email: 'user@example.com',
        lozinka: 'Abcd123!',
      });
    });
    expect(mockPush).toHaveBeenCalledWith('/korisnik');
  });

  test('shows error for invalid login', async () => {
    const user = userEvent.setup();
    mockPrijava.mockRejectedValue(new Error('Pogrešna email adresa ili lozinka'));
    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email adresa'), 'user@example.com');
    await user.type(screen.getByLabelText('Lozinka'), 'Abcd123!');
    await user.click(screen.getByRole('button', { name: 'Prijavi se' }));

    expect(await screen.findByText('Pogrešna email adresa ili lozinka')).toBeInTheDocument();
  });

  test('resend verification flow sends email and shows success message', async () => {
    const user = userEvent.setup();
    mockPrijava.mockRejectedValue(new Error('Email adresa nije potvrđena'));
    mockResend.mockResolvedValue(undefined);
    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email adresa'), 'user@example.com');
    await user.type(screen.getByLabelText('Lozinka'), 'Abcd123!');
    await user.click(screen.getByRole('button', { name: 'Prijavi se' }));

    const resendBtn = await screen.findByRole('button', { name: 'Pošalji ponovo verifikacijski email' });
    await user.click(resendBtn);

    await waitFor(() => expect(mockResend).toHaveBeenCalledWith('user@example.com'));
    expect(
      await screen.findByText('Poslali smo novi verifikacijski email. Provjerite inbox i spam folder.')
    ).toBeInTheDocument();
  });
});
