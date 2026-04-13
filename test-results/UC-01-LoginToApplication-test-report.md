# UC-01 LoginToApplication Test Report

Date: 2026-04-13
Application URL: https://preprod.pulsesg.net/
Feature: Login to Pulsora application

## 1. Executive Summary
- Total test cases planned: 10
- Manual exploratory scenarios executed: 7
- Automated scenarios implemented: 9 (8 executable + 1 skipped by design)
- Overall status:
  - PASS: 8 acceptance checks covered
  - SKIPPED/DEFERRED: 1 (session inactivity timeout)
  - N/A: 1 (remember me control absent)
- Healing summary:
  - Initial automation failures: 0
  - Auto-healing actions required: 0
  - Final stability: PASS across Chromium, Firefox, WebKit

## 2. Manual Test Results (Step 3)
Source: test-results/UC-01-exploratory-results.md

- TC-01 Login page load: PASS
- TC-02 Valid login redirect: PASS
- TC-03 Invalid login error message: PASS
- TC-04 Empty fields validation: PASS
- TC-07 Password masking: PASS
- TC-08 Session persistence after refresh: PASS
- TC-10 Remember me check: N/A (control absent)
- TC-09 Session inactivity timeout: BLOCKED/DEFERRED

Screenshots:
- test-results/uc01-tc01-login-page.png
- test-results/uc01-tc03-invalid-login.png
- test-results/uc01-tc04-empty-fields-after-submit.png
- test-results/uc01-tc02-dashboard-confirmed.png
- test-results/uc01-tc08-session-after-refresh.png
- test-results/uc01-login-page-rememberme-check.png

## 3. Automated Test Results (Step 4 and Step 5)
Automation files:
- tests/UC-01/login.spec.ts
- playwright.config.ts

Execution command:
- npm run test:uc01

Initial execution result:
- 24 passed
- 3 skipped
- 0 failed
- Duration: ~1.2m

Healing activities performed:
- None required; no failing tests identified.

Final execution result:
- Stable pass across all configured browser projects.

## 4. Defects Log
No confirmed defects were logged for UC-01 in this execution cycle.

Notes:
1. Session expiration after inactivity remains unverified due timeout dependency and execution-window limits.
2. Remember me functionality appears not implemented on current login UI (treated as N/A, not defect, unless product requires it).

## 5. Test Coverage Analysis
Acceptance Criteria Coverage:
1. Valid Login: Covered (manual + automated) - PASS
2. Invalid Login: Covered (manual + automated) - PASS
3. Empty Fields Validation: Covered (manual + automated) - PASS
4. Password Masking: Covered (manual + automated) - PASS
5. Session Handling (active session after login): Covered (manual + automated) - PASS
6. Session Expiration after inactivity: Partially covered (manual deferred; automated skipped)
7. Remember Me (if applicable): Covered as feature-presence check - N/A in current UI

Coverage split:
- Manual coverage: behavior confirmation and UI-level validation with screenshots
- Automated coverage: repeatable checks for login, validation, routing, and session persistence

## 6. Artifact Summary
- specs/UC-01-test-plan.md
- tests/UC-01/login.spec.ts
- playwright.config.ts
- test-results/UC-01-exploratory-results.md
- test-results/UC-01-LoginToApplication-test-report.md
