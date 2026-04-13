import { test, expect, Page } from '@playwright/test';

const username = process.env.PULSORA_USERNAME || 'tpg.esglm50';
const password = process.env.PULSORA_PASSWORD || 'Puls@123';

async function gotoLogin(page: Page) {
  await page.goto('/login/en_US');
  await expect(page.getByRole('heading', { name: 'Sign in to Pulsora' })).toBeVisible();
}

async function doLogin(page: Page, user: string, pass: string) {
  await page.getByPlaceholder('Username').fill(user);
  await page.getByPlaceholder('Password').fill(pass);
  await page.getByRole('button', { name: 'Sign In' }).click();
}

test.describe('UC-01 Login to Application', () => {
  test.beforeEach(async ({ page }) => {
    await gotoLogin(page);
  });

  test('TC-01: Login page loads with required controls', async ({ page }) => {
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset Password' })).toBeVisible();
  });

  test('TC-07: Password field is masked by default', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Password');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC-03: Invalid login shows error message', async ({ page }) => {
    await doLogin(page, 'invalid.user', 'Invalid@123');
    await expect(page.getByText('Invalid user credentials')).toBeVisible();
    await expect(page).toHaveURL(/\/login\/en_US/);
  });

  test('TC-04: Empty fields show required validation', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Username is a required field')).toBeVisible();
    await expect(page.getByText('Password is a required field')).toBeVisible();
    await expect(page).toHaveURL(/\/login\/en_US/);
  });

  test('TC-05: Empty username shows username required validation', async ({ page }) => {
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Username is a required field')).toBeVisible();
    await expect(page).toHaveURL(/\/login\/en_US/);
  });

  test('TC-06: Empty password shows password required validation', async ({ page }) => {
    await page.getByPlaceholder('Username').fill(username);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Password is a required field')).toBeVisible();
    await expect(page).toHaveURL(/\/login\/en_US/);
  });

  test('TC-02 + TC-08: Valid login redirects to dashboard and survives refresh', async ({ page }) => {
    await doLogin(page, username, password);
    await expect(page).toHaveURL(/\/dashboard\/en_US/);
    await expect(page.getByText('Home')).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard\/en_US/);
    await expect(page.getByText('Home')).toBeVisible();
  });

  test('TC-10: Remember me control is not present on login page', async ({ page }) => {
    const rememberMeCheckbox = page.getByRole('checkbox', { name: /remember me/i });
    await expect(rememberMeCheckbox).toHaveCount(0);
  });

  test.skip('TC-09: Session expires after inactivity (manual/config-dependent)', async () => {
    // Timeout threshold is environment controlled and too long for deterministic CI execution.
  });
});
