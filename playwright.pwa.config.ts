import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:8080';

export default defineConfig({
  testDir: './e2e',
  grep: /@pwa/,
  fullyParallel: false,
  workers: 1,
  retries: 2,
  // The app registers the service worker via registerWhenStable:30000, and its
  // periodic update poll never lets the zone settle, so registration takes ~30s.
  timeout: 120_000,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-pwa' }]],
  outputDir: 'test-results/pwa',
  use: {
    baseURL,
    serviceWorkers: 'allow',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run build && npm run http-server',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
