import { expect, test } from '@playwright/test';
import { catalog } from '../helpers';

test('serves the song catalog offline from the service worker cache @pwa', async ({ page, context }) => {
  await page.goto('/');

  // Bound the registration wait so a broken production build fails fast with a
  // meaningful condition instead of timing out silently.
  await expect
    .poll(
      async () => page.evaluate(() => navigator.serviceWorker.getRegistrations().then((r) => r.length > 0)),
      { timeout: 45_000 },
    )
    .toBe(true);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });

  // First loads are not always controlled; reload once before giving up.
  try {
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30_000 });
  } catch {
    await page.reload();
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30_000 });
  }

  // The songs asset group is prefetched, so wait until it lands in Cache Storage.
  // expect.poll awaits the promise; waitForFunction would resolve on the Promise itself.
  await expect
    .poll(
      async () => page.evaluate(async () => !!(await caches.match('/assets/songs_structured.json'))),
      { timeout: 60_000 },
    )
    .toBe(true);

  await context.setOffline(true);
  await page.reload();

  await expect(page.locator('mat-nav-list a')).toHaveCount(catalog.length);
  await expect(page.locator('mat-nav-list')).toContainText(catalog[0].title);
});
