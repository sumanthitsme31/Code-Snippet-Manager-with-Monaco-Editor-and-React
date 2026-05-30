# SnippetVault

A feature-rich code snippet manager built with React and Monaco Editor — the editor that powers VS Code.

## Features

- **Monaco Editor** — Full VS Code editor experience with syntax highlighting
- **14 language support** — JavaScript, TypeScript, Python, Go, Rust, and more
- **Local Storage persistence** — All snippets saved to `code_snippets_data` key
- **CRUD operations** — Create, read, update, and delete snippets
- **Search & Filter** — Search by title/content (debounced), filter by tags
- **Light/Dark theme** — Toggle between `vs` and `vs-dark`, persisted across sessions
- **Copy to clipboard** — One-click code copying
- **Shareable links** — Read-only view at `/snippets/view/:snippetId`
- **GitHub Gist import** — Import any public Gist by URL
- **GitHub Gist export** — Export snippets as anonymous public Gists
- **Backup/Restore** — Export all snippets to JSON, restore from JSON file
- **Docker** — Fully containerized with multi-stage Nginx build

## Quick Start

### With Docker (recommended)

```bash
docker-compose up --build -d
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Local Development

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `VITE_GITHUB_TOKEN` | Optional | GitHub PAT for authenticated API requests (higher rate limits) |
| `REACT_APP_GITHUB_TOKEN` | Optional | Alias for CRA compatibility |

## Architecture

```
src/
├── components/
│   ├── layout/       # Header
│   ├── editor/       # Monaco EditorPanel
│   ├── sidebar/      # Sidebar + SnippetList
│   └── modals/       # CreateSnippetModal
├── hooks/
│   └── useDebounce.js
├── pages/
│   ├── Dashboard.jsx # Main view
│   └── ViewSnippet.jsx # Read-only shareable view
├── services/
│   └── github.js     # Gist import/export
└── store/
    └── useStore.js   # Zustand global state + localStorage
```

## Test IDs (for E2E testing)

| `data-testid` | Element |
|---|---|
| `create-snippet-button` | Opens new snippet modal |
| `snippet-title-input` | Title input in modal |
| `snippet-language-input` | Language select in modal |
| `snippet-tags-input` | Tags input in modal |
| `save-snippet-button` | Save button in modal |
| `snippet-list` | Container of all snippet items |
| `snippet-item` | Individual snippet row |
| `delete-snippet-button` | Delete button on each snippet |
| `snippet-tag` | Clickable tag element |
| `search-input` | Global search field |
| `theme-toggle-button` | Light/dark theme toggle |
| `copy-snippet-button` | Copy code to clipboard |
| `gist-import-input` | Gist URL input field |
| `gist-import-button` | Trigger Gist import |
| `gist-export-button` | Export snippet as Gist |
| `backup-button` | Download JSON backup |
| `restore-input` | File input for JSON restore |
| `monaco-editor-container` | Monaco editor wrapper |

## Storage Keys

| Key | Description |
|---|---|
| `code_snippets_data` | All snippets (JSON array) |
| `snippet_vault_theme` | Theme preference (`vs` or `vs-dark`) |
