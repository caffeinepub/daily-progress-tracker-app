# Specification

## Summary
**Goal:** Build a daily progress tracker that supports Internet Identity login, per-user task tracking, analytics, streaks, settings (theme + CSV export), and a simple motivational quotes widget.

**Planned changes:**
- Add Internet Identity authentication and gate all features behind login, including sign-out.
- Create per-Principal user profiles with editable display name and goal type.
- Implement per-user task CRUD: create/list by selected date/edit/delete, with fields title, date, status (done/pending), optional category, optional notes.
- Add progress analytics UI and calculations: daily completion %, weekly summary, monthly summary, total completed tasks.
- Implement a streak system (choose and consistently apply one rule) showing current streak and best streak, and describe the rule in the UI.
- Create routes/screens: Splash/Landing, Login (Internet Identity), Home Dashboard, Add/Edit Task, Daily Progress, Weekly/Monthly charts, Profile/Settings; ensure navigation works.
- Add light/dark mode toggle in Settings with persistence across reloads.
- Add CSV export for the signed-in user’s task/progress data (date, title, status, category, notes).
- Add motivational quotes on the dashboard from a built-in offline list with refresh.
- Apply a coherent, friendly productivity visual theme (avoid blue/purple as primary colors).
- Render generated static images from `frontend/public/assets/generated` in the UI (e.g., logo and empty-state illustration).

**User-visible outcome:** Users can sign in with Internet Identity, manage daily tasks by date, see progress summaries and streaks, switch light/dark mode, export their data as CSV, and view/refresh a motivational quote, all within a consistent themed UI with a logo and empty-state illustration.
