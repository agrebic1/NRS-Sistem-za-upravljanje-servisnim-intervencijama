import { test, expect, type Page } from '@playwright/test';

type Creds = { email: string; password: string };

function ucitajAdminKredencijale(): Creds | null {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
}

function ucitajKorisnikKredencijale(): Creds | null {
  const email = process.env.E2E_KORISNIK_EMAIL;
  const password = process.env.E2E_KORISNIK_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
}

async function prijaviSe(page: Page, creds: Creds) {
  await page.goto('/auth/login');
  await page.getByLabel('Email adresa').fill(creds.email);
  await page.getByLabel('Lozinka').fill(creds.password);
  await page.getByRole('button', { name: 'Prijavi se' }).click();
}

test.describe('Admin create user flow', () => {
  const admin = ucitajAdminKredencijale();
  const korisnik = ucitajKorisnikKredencijale();

  test.skip(!admin || !korisnik, 'Missing E2E admin/korisnik credentials.');

  test('admin moze otvoriti stranicu za kreiranje internog naloga', async ({ page }) => {
    await prijaviSe(page, admin as Creds);
    await page.goto('/admin/korisnici/novi');
    await expect(page.getByRole('heading', { name: 'Kreiranje internog naloga' })).toBeVisible();
    await expect(page.getByLabel('Ime')).toBeVisible();
    await expect(page.getByLabel('Email adresa')).toBeVisible();
    await expect(page.getByLabel('Uloga')).toBeVisible();
  });

  test('ne-admin ne moze otvoriti stranicu za kreiranje internog naloga', async ({ page }) => {
    await prijaviSe(page, korisnik as Creds);
    await page.goto('/admin/korisnici/novi');
    await expect(page).not.toHaveURL(/\/admin\/korisnici\/novi$/);
  });
});
