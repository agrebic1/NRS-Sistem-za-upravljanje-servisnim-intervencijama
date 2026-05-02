import { test, expect } from '@playwright/test';

test.describe('Korisnik zahtjev smoke', () => {
  test('unauthenticated access to novi_zahtjev redirects to login', async ({ page }) => {
    await page.goto('/korisnik/novi_zahtjev');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('login page offers registration navigation', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('link', { name: 'Kreirajte korisnički nalog' })).toBeVisible();
  });
});
