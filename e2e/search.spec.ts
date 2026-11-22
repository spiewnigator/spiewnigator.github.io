import { expect, test } from '@playwright/test';
import { catalog, sortedTitles } from './helpers';

const songLinks = (page: import('@playwright/test').Page) => page.locator('mat-nav-list a');

test('shows the whole sorted catalog when the query is empty', async ({ page }) => {
  await page.goto('/');

  await expect(songLinks(page)).toHaveCount(catalog.length);
  await expect(songLinks(page).first()).toContainText(sortedTitles()[0]);
});

test('filters results and clears the query', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('searchbox');
  const clear = page.getByRole('button', { name: 'Clear' });

  await expect(clear).toBeDisabled();

  await search.fill('Ballada o krzyżowcu');
  await expect(songLinks(page)).toHaveCount(1);
  await expect(songLinks(page).first()).toContainText('Ballada o krzyżowcu');
  await expect(clear).toBeEnabled();

  await clear.click();
  await expect(search).toHaveValue('');
  await expect(songLinks(page)).toHaveCount(catalog.length);
  await expect(clear).toBeDisabled();
});

test('finds songs when diacritics are omitted', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox').fill('krzyzowcu');

  await expect(page.locator('mat-nav-list')).toContainText('Ballada o krzyżowcu');
});

test('enabling fuzzy search changes the result set', async ({ page }) => {
  await page.goto('/');
  // Wait for the catalog to load; the empty pre-load list would make the comparison below vacuous.
  await expect(songLinks(page)).toHaveCount(catalog.length);
  await page.getByRole('searchbox').fill('Bajka');
  // The search box debounces for 200 ms; wait for a filtered (not full) list first.
  await expect.poll(() => songLinks(page).count()).toBeLessThan(catalog.length);
  const standardCount = await songLinks(page).count();

  await page.goto('/settings');
  const fuzzyToggle = page.getByRole('switch', { name: 'Wyszukiwanie przybliżone' });
  await fuzzyToggle.click();
  await expect(fuzzyToggle).toBeChecked();

  await page.goto('/');
  await expect(songLinks(page)).toHaveCount(catalog.length);
  await page.getByRole('searchbox').fill('Bajka');
  await expect.poll(() => songLinks(page).count()).toBeLessThan(catalog.length);
  await expect.poll(() => songLinks(page).count()).toBeGreaterThan(standardCount);
});
