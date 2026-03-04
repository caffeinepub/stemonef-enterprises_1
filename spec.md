# STEMONEF Enterprises

## Current State
The app has:
- A public-facing homepage (hero, pillars, mission, feed, pathway, humanon, CTA sections)
- An Admin Dashboard (accessible via `/admin` or the bottom-left ADMIN button) for admins to manage intelligence feed entries, view collaboration requests, and pathway statistics
- Internet Identity login/logout in the NavBar
- User profile backend (`getCallerUserProfile`, `saveCallerUserProfile`) that is not yet surfaced in the UI
- Authorization system with user/admin/guest roles
- When the login button (id=2gdehu) is clicked in the NavBar, it currently just logs in/out — no dashboard opens after login

## Requested Changes (Diff)

### Add
- A `UserDashboard` page component (`src/frontend/src/pages/UserDashboard.tsx`) that shows after a regular user logs in
- The dashboard displays:
  - Welcome greeting with the user's name (editable profile section)
  - Profile card: user can set/update their display name
  - Pathway interest summary: shows which pathways the user has engaged with
  - Featured intelligence feed entries (read-only highlights)
  - Quick access cards for the 7 pillars
  - A "My Activity" section showing selected pathway and engagement stats
  - A sign out button and back-to-homepage navigation

### Modify
- `App.tsx`: Add `"dashboard"` as a new AppView. After login (`isLoginSuccess` transitions), if the user is a regular user (not admin), set view to `"dashboard"`. Keep admin routing unchanged.
- `NavBar.tsx`: When logged in, the "Sign In" button becomes a "Dashboard" button that navigates to the user dashboard, and a separate smaller "Sign Out" button appears
- The selected element (Login/Sign In button, id=2gdehu) should route to dashboard after successful login

### Remove
- Nothing removed

## Implementation Plan
1. Create `UserDashboard.tsx` page with: profile card (name edit), featured feeds section, pillar quick-access grid, pathway cards, sign-out and go-home buttons
2. Update `App.tsx` to add `"dashboard"` view, import `UserDashboard`, render it when view is `"dashboard"`, and auto-navigate to dashboard on login success
3. Update `NavBar.tsx` so that when logged in, clicking the button takes user to dashboard (pass `onDashboard` prop), and a sign-out button is available
4. Wire `saveCallerUserProfile` / `getCallerUserProfile` hooks for the name edit in the dashboard
