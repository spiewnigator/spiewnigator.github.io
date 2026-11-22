import { expect, test } from '@playwright/test';

const STORAGE_KEY = 'spiewnigator.settings.v1';

test('settings persist across a reload', async ({ page }) => {
  await page.goto('/settings');

  const hideChords = page.getByRole('switch', { name: 'Ukryj akordy' });
  const fuzzy = page.getByRole('switch', { name: 'Wyszukiwanie przybliżone' });
  const fontSize = page.getByRole('slider');

  await expect(hideChords).not.toBeChecked();
  await expect(fuzzy).not.toBeChecked();
  await expect(fontSize).toHaveAttribute('min', '12');
  await expect(fontSize).toHaveAttribute('max', '20');

  await hideChords.click();
  await fuzzy.click();
  await fontSize.focus();
  await fontSize.press('End'); // clamps at the slider maximum

  const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  expect(JSON.parse(stored ?? '{}')).toMatchObject({
    hideChords: true,
    enableFuzzySearch: true,
    fontSize: 20,
  });

  await page.reload();
  await expect(page.getByRole('switch', { name: 'Ukryj akordy' })).toBeChecked();
  await expect(page.getByRole('switch', { name: 'Wyszukiwanie przybliżone' })).toBeChecked();
  await expect(page.getByRole('slider')).toHaveValue('20');
});

test('slider stops at the configured bounds', async ({ page }) => {
  await page.goto('/settings');
  const fontSize = page.getByRole('slider');

  await fontSize.focus();
  await fontSize.press('Home');
  await expect(fontSize).toHaveValue('12');

  await fontSize.press('End');
  await expect(fontSize).toHaveValue('20');
});
