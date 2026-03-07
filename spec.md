# STEMONEF Enterprises — Admin Password-Only Gate

## Current State

The Admin Control Center at `/admin` uses a two-step login: the user enters an admin token string, which is stored in `sessionStorage`, then Internet Identity is triggered to authenticate a principal. The backend `useIsAdmin()` hook verifies whether the authenticated principal is an admin. This flow is broken/unreliable because:
- It requires Internet Identity popup, which can fail or be blocked
- `sessionStorage` clears on tab close, causing session loss
- Users without an II account cannot access the admin panel

## Requested Changes (Diff)

### Add
- Hardcoded password check: `STEMONEF-ADMIN-2026` compared client-side before any backend call
- 24-hour session persistence using `localStorage` with a stored timestamp (`stemonef_admin_session` key containing `{ token, expiresAt }`)
- Session expiry check on every page load — if `Date.now() > expiresAt`, clear session and show login gate
- A `useAdminSession` utility (inline in AdminDashboard) that reads/writes/clears the localStorage session
- Backend verification step after password matches: still call `useIsAdmin()` to confirm backend admin status, but without requiring Internet Identity popup

### Modify
- `handleAdminLogin`: replace token storage + `login()` call with: (1) password equality check, (2) store 24h session in localStorage, (3) trigger backend re-verify
- Auth gate condition: replace `!identity || !sessionStorage.getItem("caffeineAdminToken")` with `!isSessionValid()`
- Button label: change from "AUTHENTICATE WITH INTERNET IDENTITY" to "◆ ENTER CONTROL CENTER"
- Instructions block: update steps to reflect password-only flow (no II mention)
- Success message: change "TOKEN STORED · PROCEEDING TO IDENTITY VERIFICATION" to "ACCESS GRANTED · LOADING CONTROL CENTER"
- Remove `useInternetIdentity` import and all `identity`/`login`/`isInitializing` references
- Remove `isInitializing` boot spinner block

### Remove
- All Internet Identity dependency in the auth gate (`useInternetIdentity`, `login()`, `isInitializing` spinner, II-specific instructions)
- `sessionStorage` usage for admin token
- The "admin secret key" token concept — replaced by password-only

## Implementation Plan

1. Add `ADMIN_PASSWORD` constant and `useAdminSession` helpers (read/write/clear/isValid) at the top of `AdminDashboard.tsx`
2. Replace the auth gate state and logic in `AdminDashboardPage` component:
   - Remove `useInternetIdentity` hook
   - Add `isAuthenticated` state initialized from `useAdminSession().isValid()`
   - Replace `handleAdminLogin` with password check → store session → set `isAuthenticated(true)`
   - Keep `useIsAdmin()` call; gate dashboard render on both `isAuthenticated && isAdmin`
3. Replace auth gate JSX: remove II instructions, update button label, update status messages
4. Remove `isInitializing` spinner block entirely
5. Keep the "VERIFYING ACCESS..." loading state while `isLoading` (backend check) is in progress
6. Keep `onGoHome` redirect if backend confirms `isAdmin === false` after successful password entry
