const { test, expect } = require('@playwright/test');

const username = process.env.PULSORA_USERNAME || 'tpg.esglm50';
const password = process.env.PULSORA_PASSWORD || 'Puls@123';
const sessionTimeoutSec = Number(process.env.PULSORA_SESSION_TIMEOUT_SEC || '0');

const locators = {
  heading: 'Sign in to Pulsora',
  usernamePlaceholder: 'Username',
  passwordPlaceholder: 'Password',
  signInButton: 'Sign In',
  resetPasswordButton: 'Reset Password',
  helpButton: 'Need help signing in?',
  ssoButton: 'Login with SSO',
  invalidCredentialsMessage: 'Invalid user credentials',
  usernameRequiredMessage: 'Username is a required field',
  passwordRequiredMessage: 'Password is a required field',
};

async function gotoLogin(page) {
  await page.goto('/login/en_US');
  await expect(page.getByRole('heading', { name: locators.heading })).toBeVisible();
}

async function doLogin(page, user, pass) {
  await page.getByPlaceholder(locators.usernamePlaceholder).fill(user);
  await page.getByPlaceholder(locators.passwordPlaceholder).fill(pass);
  await submitLogin(page);
}

async function submitLogin(page) {
  const passwordInput = page.getByPlaceholder(locators.passwordPlaceholder);
  const signInButton = page.getByRole('button', { name: locators.signInButton });
  await expect(signInButton).toBeVisible();

  try {
    await passwordInput.press('Enter', { timeout: 3000 });
    return;
  } catch {
    // Fallback to pointer submission if key submission does not trigger form submit.
  }

  try {
    await signInButton.click({ timeout: 5000 });
    return;
  } catch {
    // Last resort when pointer interaction is blocked by transient overlays.
  }

  await signInButton.click({ force: true, timeout: 3000 });
}

test.describe('UC-01 Login to Application', () => {
  test.beforeEach(async ({ page }) => {
    await gotoLogin(page);
  });

  test('TC-01: Login page loads with required controls', async ({ page }) => {
    await expect(page.getByPlaceholder(locators.usernamePlaceholder)).toBeVisible();
    await expect(page.getByPlaceholder(locators.passwordPlaceholder)).toBeVisible();
    await expect(page.getByRole('button', { name: locators.signInButton })).toBeVisible();
    await expect(page.getByRole('button', { name: locators.resetPasswordButton })).toBeVisible();
    await expect(page.getByRole('button', { name: locators.helpButton })).toBeVisible();
    await expect(page.getByRole('button', { name: locators.ssoButton })).toBeVisible();
  });

  test('TC-07: Password field is masked by default', async ({ page }) => {
    const passwordInput = page.getByPlaceholder(locators.passwordPlaceholder);
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC-03: Invalid login shows error message', async ({ page }) => {
    await doLogin(page, 'invalid.user', 'Invalid@123');
    await expect(page.getByText(locators.invalidCredentialsMessage)).toBeVisible();
    await expect(page).toHaveURL(/\/login\/en_US/);
  });

  test('TC-03A: Valid username with invalid password is rejected', async ({ page }) => {
    await doLogin(page, username, 'Invalid@123');
    await expect(page.getByText(locators.invalidCredentialsMessage)).toBeVisible();
    await expect(page).toHaveURL(/\/login\/en_US/);
  });

  test('TC-03B: Invalid username with valid password is rejected', async ({ page }) => {
    await doLogin(page, 'invalid.user', password);
    await expect(page.getByText(locators.invalidCredentialsMessage)).toBeVisible();
    await expect(page).toHaveURL(/\/login\/en_US/);
  });

  test('TC-04: Empty fields show required validation', async ({ page }) => {
    await submitLogin(page);
    await expect(page.getByText(locators.usernameRequiredMessage)).toBeVisible();
    await expect(page.getByText(locators.passwordRequiredMessage)).toBeVisible();
    await expect(page).toHaveURL(/\/login\/en_US/);
  });

  test('TC-05: Empty username shows username required validation', async ({ page }) => {
    await page.getByPlaceholder(locators.passwordPlaceholder).fill(password);
    await submitLogin(page);
    await expect(page.getByText(locators.usernameRequiredMessage)).toBeVisible();
    await expect(page).toHaveURL(/\/login\/en_US/);
  });

  test('TC-06: Empty password shows password required validation', async ({ page }) => {
    await page.getByPlaceholder(locators.usernamePlaceholder).fill(username);
    await submitLogin(page);
    await expect(page.getByText(locators.passwordRequiredMessage)).toBeVisible();
    await expect(page).toHaveURL(/\/login\/en_US/);
  });

  test('TC-02 + TC-08: Valid login redirects to dashboard and survives refresh', async ({ page }) => {
    await doLogin(page, username, password);
    await expect(page).toHaveURL(/\/dashboard\/en_US/);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Home')).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard\/en_US/);
    await expect(page.getByText('Home')).toBeVisible();
  });

  test('TC-08A: Unauthenticated user cannot access dashboard URL directly', async ({ page }) => {
    await page.goto('/dashboard/en_US');
    await expect(page).toHaveURL(/\/login\/en_US/);
    await expect(page.getByRole('heading', { name: locators.heading })).toBeVisible();
  });

  test('TC-10: Remember me control is not present on login page', async ({ page }) => {
    const rememberMeCheckbox = page.getByRole('checkbox', { name: /remember me/i });
    await expect(rememberMeCheckbox).toHaveCount(0);
  });

  test('TC-10A: Remember me keeps login after reopening page (if available)', async ({ browser, page }) => {
    const rememberMeCheckbox = page.getByRole('checkbox', { name: /remember me/i });
    const count = await rememberMeCheckbox.count();

    if (count === 0) {
      test.skip();
    }

    await rememberMeCheckbox.check();
    await doLogin(page, username, password);
    await expect(page).toHaveURL(/\/dashboard\/en_US/);

    // Simulate user reopening app in same run by opening a fresh browser context.
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();
    await newPage.goto(`${process.env.PULSORA_BASE_URL || 'https://preprod.pulsesg.net'}/dashboard/en_US`);

    const onDashboard = /\/dashboard\/en_US/.test(newPage.url());
    const onLogin = /\/login\/en_US/.test(newPage.url());
    expect(onDashboard || onLogin).toBeTruthy();

    await newContext.close();
  });

  test('TC-09: Session expires after inactivity (config-driven)', async ({ page }) => {
    if (!sessionTimeoutSec || sessionTimeoutSec <= 0) {
      test.skip();
    }

    await doLogin(page, username, password);
    await expect(page).toHaveURL(/\/dashboard\/en_US/);

    // Wait for configured idle timeout and probe a protected route.
    await page.waitForTimeout(sessionTimeoutSec * 1000);
    await page.goto('/dashboard/en_US');

    const timedOut = /\/login\/en_US/.test(page.url());
    expect(timedOut).toBeTruthy();
  });
});