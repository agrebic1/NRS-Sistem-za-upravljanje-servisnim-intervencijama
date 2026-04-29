import { test, expect, type Page } from '@playwright/test';

type RoleCreds = {
  email: string;
  password: string;
};

function ucitajKredencijale(role: 'serviser' | 'dispecer'): RoleCreds | null {
  const prefix = role === 'serviser' ? 'E2E_SERVISER' : 'E2E_DISPECER';
  const email = process.env[`${prefix}_EMAIL`];
  const password = process.env[`${prefix}_PASSWORD`];

  if (!email || !password) return null;

  return { email, password };
}

async function prijaviSe(page: Page, creds: RoleCreds) {
  await page.goto('/auth/login');
  await page.getByLabel('Email adresa').fill(creds.email);
  await page.getByLabel('Lozinka').fill(creds.password);
  await page.getByRole('button', { name: 'Prijavi se' }).click();
}

test.describe('RBAC cross-access', () => {
  const serviser = ucitajKredencijale('serviser');
  const dispecer = ucitajKredencijale('dispecer');

  test.skip(!serviser || !dispecer, 'Missing E2E role credentials in environment variables.');

  test('serviser ne moze otvoriti korisnik i dispecer rute', async ({ page }) => {
    await prijaviSe(page, serviser as RoleCreds);

    await page.goto('/korisnik');
    await expect(page).toHaveURL('/');

    await page.goto('/dispecer');
    await expect(page).toHaveURL('/');
  });

  test('dispecer ne moze otvoriti korisnik i serviser rute', async ({ page }) => {
    await prijaviSe(page, dispecer as RoleCreds);

    await page.goto('/korisnik');
    await expect(page).toHaveURL('/');

    await page.goto('/serviser');
    await expect(page).toHaveURL('/');
  });
});
