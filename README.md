# Books MVVM

A small books app refactored to a fast-test architecture: all business and UX logic lives in plain
TypeScript classes covered by unit tests, and React components only render observable view models.

## Getting started

Requirements: Node.js 22.13+ (CI runs on Node 24).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests
```

The app uses the API user `ruslan`. To use your own nickname:

```bash
VITE_API_USER=your-nickname npm run dev
```

| Script                            | Purpose                        |
| --------------------------------- | ------------------------------ |
| `npm run dev`                     | Start the dev server           |
| `npm test` / `npm run test:watch` | Run the unit tests (Vitest)    |
| `npm run lint`                    | ESLint (strict type-checked)   |
| `npm run typecheck`               | TypeScript project build check |
| `npm run format` / `format:check` | Prettier                       |
| `npm run build`                   | Production build               |

CI (GitHub Actions) runs format check, lint, typecheck, tests and build on every push.

## Features

- List of books loaded from the API.
- Adding a book (title + author, both required).
- Mutually exclusive **All books / Private books** switch.
- Sticky application header with the private books counter: `Your books: N`.

## Architecture

```
View ──actions──▶ Controller ──PM──▶ Repository ──DTO──▶ HttpGateway ──▶ REST API
     ◀──VM (observable)──     ◀──PM──             ◀──DTO──
```

| Layer          | Responsibility                                                                             | Files                 |
| -------------- | ------------------------------------------------------------------------------------------ | --------------------- |
| **View**       | Functional `observer` components. Render the view model and forward user events. No logic. | `*.tsx`               |
| **Controller** | Per-component state, derived values, validation, messages, user actions (MobX).            | `*Controller.ts`      |
| **Store**      | Application-wide shared data: all/private books, loading state.                            | `BooksStore.ts`       |
| **Repository** | Which resource to call, DTO ⇄ domain model mapping, response interpretation.               | `BooksRepository.ts`  |
| **Gateway**    | HTTP transport only: base URL, JSON, status check.                                         | `FetchHttpGateway.ts` |

Models:

- **DTO** — API format: `{ id?, name, author, ownerId? }`.
- **PM** (domain model) — `Book { id, title, author }`.
- **VM** — ready-to-render data: `{ key, label: "Author: Title" }`, `isSubmitDisabled`, `statusMessage`, etc.

### Project structure

```
src/
├── core/                 # infrastructure: http gateway, config, dependency wiring, controller lifecycle
├── shared/ui/            # reusable presentational components (SegmentedControl, TextField)
├── features/
│   ├── books/            # books domain: model, repository, shared store
│   │   ├── BooksList/    # list + All/Private switch
│   │   └── AddBookForm/  # book creation
│   └── header/           # sticky header with the private books counter
└── test/                 # in-memory fake of the books API used by the tests
```

### Key decisions

- **Dependency injection without a container.** Dependencies are passed through constructors and
  wired once in `createDependencies` (composition root), then provided through a React context.
  Tests build the same graph with an in-memory `FakeBooksApi` instead of `fetch`.
- **Controller lifecycle.** `useController` creates a local controller once per component instance;
  controllers that own resources implement `Lifecycle` (`mount` / `unmount`). `BooksListController`
  starts loading on mount and aborts the in-flight requests on unmount (`AbortController`).
- **Render efficiency.** State changes after `await` are applied in a single `runInAction` batch
  (covered by a test that counts reaction notifications). A newer load aborts the previous one, so
  stale responses never overwrite fresh data.
- **Shared vs local state.** Books live in the global `BooksStore` because both the list and the
  header depend on them; filter selection and form fields are local controller state.
- **Open/closed filters.** Filters are declared as data (`key`, `label`, `selectBooks`), so adding
  a new one does not touch the controller logic.
- **Libraries.** MobX 7 + `mobx-react-lite` (the function-component binding of `mobx-react`),
  React 19, Vite, Vitest, ESLint `strictTypeChecked`, Prettier.

## Testing

Tests target controllers, the store and the repository — no DOM, no React rendering — and run in
~100 ms. They use the real repository and store with a fake HTTP gateway, so the DTO mapping and
the controller logic are verified together.

## Issues fixed from the original sandbox

- `addBook` posted to `/{user}/books`, which returns **404**; the API expects `POST /{user}/`.
- `response.json()` was not awaited and HTTP errors were not checked.
- The list used array indexes as React keys.
- Books created through the API come back without an `id`; the repository falls back to the list
  position so React keys stay unique.
