import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { catalog } from './helpers';

const songLinks = (page: Page) => page.locator('mat-nav-list a');
const scrollY = (page: Page) => page.evaluate(() => window.scrollY);

/** Finds a query that matches every song, so typing it removes no rows from the list. */
function queryMatchingWholeCatalog(): string {
    const alphabet = 'aąbcćdeęfghijklłmnńoópqrsśtuwxyzźż';
    const character = [...alphabet].find(ch => catalog.every(song => [
        song.title,
        song.author ?? '',
        ...song.content.flat().map(line => line.split('\t')[0])
    ].join(' ').toLocaleLowerCase('pl').includes(ch)));
    if (!character) {
        throw new Error('No single character matches the whole catalog; revise this test.');
    }
    return character;
}

async function expectScrollNear(page: Page, expected: number): Promise<void> {
    await expect.poll(async () => Math.abs((await scrollY(page)) - expected)).toBeLessThanOrEqual(2);
}

test('restores the scroll position in the full list after visiting a song', async ({ page }) => {
    await page.goto('/');
    const links = songLinks(page);
    await expect(links).toHaveCount(catalog.length);

    const target = page.getByRole('link', { name: 'Źródło' });
    await target.scrollIntoViewIfNeeded();
    const before = await scrollY(page);
    expect(before).toBeGreaterThan(0);

    await target.click();
    await expect(page).toHaveURL(/\/song\/\d+$/);
    await expect.poll(() => scrollY(page)).toBe(0);

    await page.getByLabel('Return to song list').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(links).toHaveCount(catalog.length);
    await expectScrollNear(page, before);
});

test('restores the filtered list and the query after visiting a song', async ({ page }) => {
    await page.goto('/');
    const links = songLinks(page);
    await expect(links).toHaveCount(catalog.length);
    const search = page.getByRole('searchbox');

    await search.fill('nie');
    await expect.poll(() => links.count()).toBeLessThan(catalog.length);
    const count = await links.count();
    expect(count).toBeGreaterThan(1);

    const candidate = links.nth(count - 2);
    await candidate.scrollIntoViewIfNeeded();
    const before = await scrollY(page);
    expect(before).toBeGreaterThan(0);

    await candidate.click();
    await expect(page).toHaveURL(/\/song\/\d+$/);
    await page.getByLabel('Return to song list').click();

    await expect(page).toHaveURL(/\/\?q=nie$/);
    await expect(search).toHaveValue('nie');
    await expect(links).toHaveCount(count);
    await expectScrollNear(page, before);
});

test('lands on the first search result rather than the top of the catalog', async ({ page }) => {
    await page.goto('/');
    const links = songLinks(page);
    await expect(links).toHaveCount(catalog.length);
    const search = page.getByRole('searchbox');

    await search.fill('Ballada o krzyżowcu');
    await expect(links).toHaveCount(1);
    const target = links.first();
    await expect(target).toContainText('Ballada o krzyżowcu');
    await target.click();
    await expect(page).toHaveURL(/\/song\/\d+$/);
    await page.getByLabel('Return to song list').click();

    await expect(page).toHaveURL(/\?q=/);
    await expect(search).toHaveValue('Ballada o krzyżowcu');
    await expect(links).toHaveCount(1);
    await expect(links.first()).toContainText('Ballada o krzyżowcu');
    expect(await scrollY(page)).toBe(0);
});

test('does not jump the scroll position while typing or clearing', async ({ page }) => {
    await page.goto('/');
    const links = songLinks(page);
    await expect(links).toHaveCount(catalog.length);
    const search = page.getByRole('searchbox');

    await search.focus();
    await page.evaluate(() => window.scrollTo(0, 1500));
    const before = await scrollY(page);
    expect(before).toBeGreaterThan(0);

    // No rows are removed, so the only possible scroll change is a router-induced jump.
    const query = queryMatchingWholeCatalog();
    await page.keyboard.type(query);
    await expect(page).toHaveURL(/\?q=/);
    await expect(page.getByRole('searchbox')).toHaveValue(query);
    await expect(links).toHaveCount(catalog.length);
    await expectScrollNear(page, before);

    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Backspace');
    await expect(page).toHaveURL(/\/$/);
    await expect(links).toHaveCount(catalog.length);
    await expectScrollNear(page, before);
});

test('prefills the search box from ?q= on a deep link', async ({ page }) => {
    const expectedTitles = catalog
        .map(song => song.title)
        .filter(title => title.toLocaleLowerCase('pl').includes('ballada'))
        .sort((a, b) => a.localeCompare(b, 'pl'));

    await page.goto('/?q=Ballada');
    await expect(page.getByRole('searchbox')).toHaveValue('Ballada');

    const links = songLinks(page);
    await expect(links).toHaveCount(expectedTitles.length);
    await expect(links.first()).toContainText(expectedTitles[0]);
});
