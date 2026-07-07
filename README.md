# Digital Time Capsule

Seal a message (and optional photos) to your future self, pick a date it unlocks, and it stays sealed until then.

## What it does

- **Create a capsule** — a title, a message, optional notes, optional photos, and an unlock date/time.
- **Locked view** — until the unlock date arrives, only the title and a live countdown are shown.
- **Unlocked view** — once the unlock date passes, the full message, notes, and photos become visible.
- **Delete or share** — a capsule can be deleted at any time. It cannot be edited after creation.

## Public vs. private

Every capsule is marked either 🔐 **Private** or 🌐 **Public** at creation time:

- **Private** capsules never show a share link anywhere in the UI. Their data still lives in the server's storage, but is only ever fetched by this app for its own list view — it isn't published anywhere.
- **Public** capsules show a "Copy share link" button as soon as they're created — no need to wait for it to unlock. The link is fully self-contained: the capsule's data is base64-encoded directly into the URL hash (see `src/utils/shareUtils.js`), so opening it needs no extra server request, account, or database lookup. Anyone with the link can open a full-page view of the capsule; if it's still locked they'll see only the title and countdown, and the full content once it unlocks.

This is a single-user demo with no accounts, so visibility is a UI-level choice, not an enforced permission: there's no auth or per-capsule access control on the API — anything that reaches the "Copy share link" button (or is manually crafted from a capsule's data) will open.

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) on the frontend
- [Express 5](https://expressjs.com/) backend (`server/`) with [lowdb](https://github.com/typicode/lowdb) for storage — capsules persist to a JSON file on disk (`server/data/db.json`), not the browser, so they survive a cache clear or a different browser/device hitting the same server
- No routing library — the app is a single component tree; a shared capsule link is detected via the URL hash, which never touches the server
- In dev, Vite proxies `/api/*` requests to the Express server (see `vite.config.js`); in production, Express serves the built frontend and the API from a single process

## Running locally

```bash
npm install
npm run dev
```

This starts both the Vite dev server and the Express API together. The app opens at the Vite URL (usually `http://localhost:5173`); the API listens on `http://localhost:3001`.

Other scripts:

```bash
npm run build    # production build of the frontend into dist/
npm start        # run the Express server, serving the built dist/ + the API on one port
npm run preview  # preview the production build via Vite (no API - use `npm start` for the full app)
npm run lint      # oxlint
```

## Project structure

```
server/
  index.js                    # Express app: mounts the API, serves dist/ in production
  db.js                       # lowdb setup (server/data/db.json)
  routes/
    capsules.js               # GET / POST / DELETE /api/capsules

src/
  App.jsx                     # top-level state and layout, talks to the API
  api.js                      # fetch wrappers for the capsules API
  components/
    CapsuleForm.jsx           # create-capsule form
    CapsuleGrid.jsx           # grid of capsule cards
    CapsuleCard.jsx           # single capsule tile (open/delete)
    CapsuleDetail.jsx         # full capsule view (locked or unlocked), share button
    SharedCapsuleView.jsx     # full-page read-only view for a shared link
    CountdownTimer.jsx        # days/hours/minutes/seconds countdown
    ImageUploader.jsx         # photo attachment input
    Modal.jsx / ConfirmDialog.jsx
  hooks/
    useNow.js                 # ticking clock, drives countdowns/unlocks
  utils/
    dateUtils.js               # unlock/countdown/date-formatting helpers
    fileUtils.js                # image file -> data URL
    shareUtils.js                # encode/decode a capsule into a shareable link
```
