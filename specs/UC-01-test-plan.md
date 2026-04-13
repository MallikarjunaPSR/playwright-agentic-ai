# UC-01 Test Plan: Login to Pulsora Application

## 1. Scope
This plan validates the UC-01 login workflow for Pulsora, including positive login, negative login, validation behavior, password masking, session handling, and remember-me behavior if present.

## 2. Test Environment
- URL: https://preprod.pulsesg.net/
- Browser targets: Chromium, Firefox, WebKit
- Test account (valid):
  - Username: tpg.esglm50
  - Password: Puls@123
- Invalid credential sample:
  - Username: invalid.user
  - Password: Invalid@123

## 3. In Scope Features
- Login form rendering and input behavior
- Authentication success and failure flows
- Required field validations
- Password masking security behavior
- Session persistence and inactivity handling signals
- Remember me option behavior (if UI control exists)

## 4. Out of Scope
- SSO and external identity provider integrations
- MFA flows not visible in this story
- Backend API performance testing

## 5. Test Scenarios

### TC-01: Login Page Loads Successfully
- Objective: Verify login page and controls are visible and usable.
- Test Data: None
- Steps:
  1. Navigate to the application URL.
  2. Verify username input is visible.
  3. Verify password input is visible.
  4. Verify login/submit button is visible and enabled or conditionally enabled.
- Expected Results:
  - Login page loads without error.
  - Core controls render correctly.

### TC-02: Valid Login Redirects to Dashboard
- Objective: Validate successful authentication and dashboard landing.
- Test Data:
  - Username: tpg.esglm50
  - Password: Puls@123
- Steps:
  1. Enter valid username.
  2. Enter valid password.
  3. Click login/submit.
  4. Observe post-login navigation.
- Expected Results:
  - User is authenticated.
  - User is redirected to dashboard/home area.
  - No login error message appears.

### TC-03: Invalid Login Shows Error
- Objective: Validate authentication error handling.
- Test Data:
  - Username: invalid.user
  - Password: Invalid@123
- Steps:
  1. Enter invalid username and invalid password.
  2. Click login/submit.
- Expected Results:
  - Login is rejected.
  - User remains on login page.
  - Clear authentication error message appears.

### TC-04: Empty Username and Password Validation
- Objective: Verify required field validation when both fields are empty.
- Test Data: None
- Steps:
  1. Leave username and password blank.
  2. Click login/submit.
- Expected Results:
  - Validation message(s) appear for required fields.
  - Login is not submitted.

### TC-05: Empty Username Validation
- Objective: Verify username required validation.
- Test Data:
  - Password: Puls@123
- Steps:
  1. Leave username blank.
  2. Enter password.
  3. Click login/submit.
- Expected Results:
  - Username required validation is shown.
  - Login is not submitted.

### TC-06: Empty Password Validation
- Objective: Verify password required validation.
- Test Data:
  - Username: tpg.esglm50
- Steps:
  1. Enter username.
  2. Leave password blank.
  3. Click login/submit.
- Expected Results:
  - Password required validation is shown.
  - Login is not submitted.

### TC-07: Password Field Is Masked
- Objective: Confirm password security masking by default.
- Test Data:
  - Password sample: Puls@123
- Steps:
  1. Focus password field.
  2. Type password sample.
  3. Inspect password input type.
- Expected Results:
  - Password characters are masked.
  - Input control type is password by default.

### TC-08: Session Persists Across Navigation/Refresh
- Objective: Validate active session behavior after login.
- Test Data:
  - Username: tpg.esglm50
  - Password: Puls@123
- Steps:
  1. Log in with valid credentials.
  2. Refresh the browser.
  3. Navigate to one additional authenticated area.
- Expected Results:
  - User remains authenticated after refresh.
  - Protected pages remain accessible.

### TC-09: Session Expiration After Inactivity (Config-Dependent)
- Objective: Validate auto-expiry behavior after inactivity window.
- Test Data:
  - Username: tpg.esglm50
  - Password: Puls@123
- Steps:
  1. Log in with valid credentials.
  2. Remain idle for configured timeout period.
  3. Attempt action/navigation.
- Expected Results:
  - Session expires after configured inactivity threshold.
  - User is prompted to re-authenticate.
- Note:
  - Timeout value may be environment-configured and could exceed execution window.

### TC-10: Remember Me Behavior (If Available)
- Objective: Validate remember-me persistence if control exists.
- Test Data:
  - Username: tpg.esglm50
  - Password: Puls@123
- Steps:
  1. On login page, check for a remember-me option.
  2. If available, enable remember-me.
  3. Log in, close browser, reopen app.
- Expected Results:
  - If feature exists and enabled, login persistence follows expected behavior.
  - If feature not present, scenario is marked Not Applicable.

## 6. Exit Criteria
- All executable scenarios have recorded outcomes.
- Blocking issues are documented with evidence.
- Automation baseline covers executable acceptance criteria.
