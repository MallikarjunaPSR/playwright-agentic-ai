# UC-01 Exploratory Testing Results

Date: 2026-04-13
Application: https://preprod.pulsesg.net/login/en_US
Tester/Executor: GitHub Copilot via Playwright MCP browser tools

## Scope Executed
- TC-01 Login page load and controls
- TC-02 Valid login redirect
- TC-03 Invalid login error handling
- TC-04 Empty username and password validation
- TC-07 Password masking
- TC-08 Session persistence after refresh
- TC-10 Remember me check (feature presence)

## Scenario Results
1. TC-01 Login page load and controls: PASS
- Login page loaded with Username, Password, Sign In, Reset Password, Need help signing in, Login with SSO controls.

2. TC-02 Valid login redirect: PASS
- Valid credentials redirected user to dashboard.
- Observed URL transition to /dashboard/en_US.

3. TC-03 Invalid login: PASS
- Invalid credentials kept user on login page.
- Error text observed: Invalid user credentials.

4. TC-04 Empty fields validation: PASS
- Clicking Sign In with empty fields displayed:
  - Username is a required field
  - Password is a required field

5. TC-07 Password masking: PASS
- Password field input type observed as password.

6. TC-08 Session persistence after refresh: PASS
- After successful login, refresh/navigation retained authenticated dashboard access.

7. TC-10 Remember me presence check: N/A
- No Remember me control observed on the login page.

## Blocked/Deferred
1. TC-09 Session expiration after inactivity: BLOCKED/DEFERRED
- Requires environment-configured inactivity window and long wait not suitable for deterministic same-session execution.

## Evidence (Screenshots)
- test-results/uc01-tc01-login-page.png
- test-results/uc01-tc03-invalid-login.png
- test-results/uc01-tc04-empty-fields.png
- test-results/uc01-tc04-empty-fields-after-submit.png
- test-results/uc01-tc02-dashboard-confirmed.png
- test-results/uc01-tc08-session-after-refresh.png
- test-results/uc01-login-page-rememberme-check.png
- test-results/uc01-profile-menu-open.png

## Observations
1. Validation and auth errors are clearly rendered on login page.
2. Login form presents no Remember me option in this environment.
3. Some MCP snapshots were transient during navigation, but URL transitions and stable snapshots confirmed outcomes.
