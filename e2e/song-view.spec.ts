import { expect, test } from '@playwright/test';
import { catalog } from './helpers';

const firstLineText = catalog[0].content[0][0].split('\t')[0];

test('renders the song title, lyrics and chords', async ({ page }) => {
  await page.goto('/song/0');

  await expect(page.getByLabel('Return to song list')).toBeVisible();
  await expect(page.locator('mat-toolbar').getByText(catalog[0].title)).toBeVisible();
  await expect(page.locator('.line').first()).toContainText(firstLineText);
  await expect(page.locator('.line').first()).toHaveCSS('font-size', '16px');
  await expect(page.locator('.line').first()).toHaveCSS('color', 'rgb(232, 234, 237)');
  await expect(page.locator('.chord').first()).toBeVisible();
});

test('applies font size from settings', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'spiewnigator.settings.v1',
      JSON.stringify({ hideChords: false, fontSize: 18, enableFuzzySearch: false }),
    );
  });

  await page.goto('/song/0');
  await expect(page.locator('.line').first()).toHaveCSS('font-size', '18px');
});

test('bold text applies to lyrics but not chords', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'spiewnigator.settings.v1',
      JSON.stringify({ hideChords: false, fontSize: 16, enableFuzzySearch: false, boldText: true }),
    );
  });

  await page.goto('/song/0');
  await expect(page.locator('.line').first()).toHaveCSS('font-weight', '700');
  await expect(page.locator('.chord').first()).toHaveCSS('font-weight', '400');
});

test('hides chords when the setting is enabled', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'spiewnigator.settings.v1',
      JSON.stringify({ hideChords: true, fontSize: 14, enableFuzzySearch: false }),
    );
  });

  await page.goto('/song/0');
  await expect(page.locator('.line').first()).toBeVisible();
  await expect(page.locator('.chord')).toHaveCount(0);
});
