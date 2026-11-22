import { expect, test } from '@playwright/test';

test('opens the song list and navigates through the toolbar', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Help' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
  await expect(page.getByRole('searchbox')).toBeVisible();

  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByText('Ukryj akordy')).toBeVisible();

  await page.goto('/');
  await page.getByRole('button', { name: 'Help' }).click();
  await expect(page).toHaveURL(/\/help$/);
});

test('returns to the song list from a song view', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /A piosnka/ }).click();
  await expect(page).toHaveURL(/\/song\/0$/);

  await page.getByLabel('Return to song list').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('searchbox')).toBeVisible();
});
