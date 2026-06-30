# Market Trend Innovation Studio

> **Prototype Disclaimer:** This is an MVP prototype for demonstration purposes only. Data is stored locally in your browser and is not persisted to any server. All generated content (opportunity statements, personas, concepts, scoring, backlogs, and executive summaries) is produced using template-based interpolation and randomized mock data — not AI/LLM inference.

## Overview

Market Trend Innovation Studio (MTIS) is a single-page web application that helps product innovation teams explore market trends, generate product concepts, evaluate them with weighted scoring, and produce executive pitch summaries. The tool guides users through a structured five-step workflow:

1. **Create Workspace** — Define target region, market segment, trend theme, and strategic goal.
2. **Review Insights** — Explore auto-generated opportunity statements and persona profiles.
3. **Evaluate Concepts** — Review a shortlist of 3–5 generated concepts, score them against weighted criteria, and view the feasibility & value matrix.
4. **Generate Backlog** — Produce a structured product backlog (epics → features → user stories with acceptance criteria) from selected concepts.
5. **Executive Summary** — Generate a presentation-ready pitch summary with problem, opportunity, recommendation, risks, assumptions, and next steps.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (JSX) |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 6 (createBrowserRouter) |
| State Management | React Context (WorkspaceContext, NotificationContext) |
| Persistence | Browser localStorage |
| Testing | Vitest + React Testing Library |
| Linting | ESLint 9 |
| Formatting | Prettier 3 |
| Unique IDs | uuid v4 |
| File Downloads | file-saver |
| Type Checking | PropTypes |

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or compatible package manager)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd market-trend-innovation-studio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and adjust values as needed:

```bash
cp .env.example .env.local
```

Available environment variables:

| Variable | Default | Description |
|---|---|---|
| `VITE_APP_TITLE` | `Market Trend Innovation Studio` | Application title displayed in the browser tab and header |
| `VITE_APP_VERSION` | `1.0.0` | Application version string (semver) |
| `VITE_BRAND_MODE` | `placeholder` | Brand mode for theming. Options: `placeholder` (generic), `givaudan` (branded) |

All client-side variables must be prefixed with `VITE_` and are accessed via `import.meta.env.VITE_*`.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### 5. Build for Production

```bash
npm run build
```

Output is written to the `dist/` directory.

### 6. Preview Production Build

```bash
npm run preview
```

### 7. Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### 8. Lint

```bash
npm run lint
```

## Project Structure

```
market-trend-innovation-studio/
├── index.html                          # HTML entry point
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Vite build configuration
├── vitest.config.js                    # Vitest test configuration
├── vitest.setup.js                     # Test setup (jest-dom, localStorage mock)
├── tailwind.config.js                  # Tailwind CSS configuration
├── postcss.config.js                   # PostCSS configuration
├── .eslintrc.cjs                       # ESLint configuration
├── .prettierrc                         # Prettier configuration
├── .env.example                        # Environment variable template
├── vercel.json                         # Vercel deployment rewrites
├── src/
│   ├── main.jsx                        # React DOM entry point
│   ├── App.jsx                         # Root component with context providers
│   ├── router.jsx                      # Route definitions (createBrowserRouter)
│   ├── index.css                       # Tailwind directives and base styles
│   ├── components/
│   │   ├── backlog/
│   │   │   ├── BacklogItem.jsx         # Single backlog item (epic/feature/story)
│   │   │   └── BacklogList.jsx         # Full backlog list with filters
│   │   ├── common/
│   │   │   ├── Badge.jsx               # Reusable badge/tag component
│   │   │   ├── Button.jsx              # Reusable button with variants
│   │   │   ├── Card.jsx                # Card container component
│   │   │   ├── ConfidenceBadge.jsx     # Confidence level indicator
│   │   │   ├── EditDialog.jsx          # Generic edit modal dialog
│   │   │   ├── EmptyState.jsx          # Empty state placeholder
│   │   │   ├── ExportMenu.jsx          # Export dropdown (CSV/JSON/clipboard)
│   │   │   ├── Footer.jsx              # Application footer
│   │   │   ├── FormField.jsx           # Reusable form field wrapper
│   │   │   ├── Header.jsx              # Application header with navigation
│   │   │   ├── LoadingSpinner.jsx      # Loading spinner with message
│   │   │   ├── Modal.jsx               # Modal dialog with focus trap
│   │   │   ├── NotificationToast.jsx   # Toast notification display
│   │   │   ├── PrototypeBanner.jsx     # Dismissible prototype disclaimer
│   │   │   ├── StepIndicator.jsx       # Workflow step progress indicator
│   │   │   └── Tooltip.jsx             # Hover/focus tooltip component
│   │   ├── concepts/
│   │   │   ├── ConceptCard.jsx         # Single concept display card
│   │   │   └── ConceptShortlist.jsx    # Concept list with selection controls
│   │   ├── matrix/
│   │   │   ├── MatrixTable.jsx         # Feasibility & value scoring matrix
│   │   │   ├── ScoringConfigPanel.jsx  # Scoring weight configuration panel
│   │   │   └── ScoringRationale.jsx    # Scoring rationale breakdown
│   │   ├── pitch/
│   │   │   └── ExecutiveSummary.jsx    # Executive pitch summary display
│   │   └── workspace/
│   │       ├── AssumptionsRisks.jsx    # Editable assumptions/risks/missing info
│   │       ├── OpportunityStatement.jsx# Opportunity statement with highlights
│   │       ├── PersonaCard.jsx         # Persona profile card
│   │       ├── WorkspaceCard.jsx       # Workspace summary card for dashboard
│   │       ├── WorkspaceForm.jsx       # Create/edit workspace form
│   │       └── WorkspaceList.jsx       # Workspace grid with search/filter
│   ├── context/
│   │   ├── NotificationContext.jsx     # Toast notification state management
│   │   └── WorkspaceContext.jsx        # Workspace CRUD state management
│   ├── data/
│   │   └── mockData.js                 # Sample data templates and generators
│   ├── layouts/
│   │   └── MainLayout.jsx             # Page layout (header, content, footer)
│   ├── pages/
│   │   ├── CreateWorkspacePage.jsx     # Workspace creation page
│   │   ├── DashboardPage.jsx           # Dashboard with workspace listing
│   │   ├── NotFoundPage.jsx            # 404 error page
│   │   ├── ScoringConfigPage.jsx       # Scoring weight configuration page
│   │   └── WorkspaceDetailPage.jsx     # Full workspace detail view
│   ├── services/
│   │   ├── backlogGenerator.js         # Backlog generation (epics/features/stories)
│   │   ├── conceptEvaluator.js         # Concept scoring, ranking, explanation
│   │   ├── conceptGenerator.js         # Concept shortlist generation
│   │   ├── editRegenerateService.js    # Edit and regenerate workspace outputs
│   │   ├── exportService.js            # CSV, JSON, clipboard export
│   │   ├── localStorageService.js      # localStorage abstraction layer
│   │   ├── opportunityGenerator.js     # Opportunity statement generation
│   │   ├── personaGenerator.js         # Persona profile generation
│   │   ├── pitchSummaryGenerator.js    # Executive summary generation
│   │   ├── scoringConfig.js            # Scoring criteria weights configuration
│   │   └── workspaceManager.js         # Workspace CRUD operations
│   ├── test/
│   │   └── setup.js                    # Test setup file (referenced by vitest)
│   └── utils/
│       ├── constants.js                # Application-wide constants
│       ├── helpers.js                  # Utility functions (ID, date, classNames)
│       └── validators.js              # Input validation functions
└── public/
    └── vite.svg                        # Default Vite favicon
```

## Features

### Workspace Management
- Create, edit, and delete innovation workspaces
- Configure target region, market segment, trend theme, and strategic goal
- Dashboard with workspace cards, search, filter by region/segment, and sort options
- Summary statistics (total workspaces, concepts generated, backlogs created, storage usage)

### Opportunity Statement
- Auto-generated opportunity statements based on workspace context
- Keyword highlighting (opportunity, business relevance, target segment, region, unmet need)
- Inline editing with character count and validation
- Copy to clipboard functionality
- Confidence badge indicator

### Persona Generation
- B2B and end-consumer persona profiles
- Contextual needs, preferences, decision drivers, and constraints
- Avatar placeholder with persona type badge
- Inline editing with editable list sections
- Collapsible detail sections (goals, pain points, behaviors)

### Concept Shortlist
- 3–5 generated product concepts per workspace
- Concept cards with value proposition, target user, differentiation, and key features
- Selectable checkboxes for shortlisting
- Sort by score, name, or rank
- Expandable details (rationale, evidence notes, score breakdown)

### Feasibility & Value Matrix
- Sortable scoring matrix table with all evaluation criteria
- Color-coded score cells (green/amber/red) with tooltip rationale
- Weighted total calculation with configurable weights
- Rank badges and confidence indicators
- Score legend and hover instructions
- Detailed scoring rationale panel with criterion breakdown

### Scoring Configuration
- Adjustable weights for each scoring criterion via sliders and number inputs
- Real-time total weight validation (must sum to 100%)
- Save to localStorage and reset to defaults
- Visual indicators for modified weights

### Product Backlog
- Hierarchical backlog: epics → features → user stories → acceptance criteria
- Priority tagging (MVP, Next Release, Future Enhancement)
- Status management (Idea, Under Review, Approved, In Progress, Completed, Archived)
- Filter by tag and type
- Inline editing of items
- Tag distribution summary

### Executive Pitch Summary
- Structured sections: problem, opportunity, target segment, recommended concept, value proposition, feasibility assessment, risks, next steps
- Confidence badge and context badges (region, segment, trend, goal)
- Copy to clipboard and print support
- Reviewer comment field
- Expandable additional sections (market context, strategic rationale, assumptions, missing info)

### Assumptions, Risks & Missing Info
- Editable lists for assumptions, risks, and missing information
- Add, remove, and inline edit items
- Collapsible category sections with item counts
- Summary footer with category totals

### Export
- Export to CSV (concepts, scoring, backlog)
- Export to JSON (all output types including full workspace)
- Copy to clipboard (formatted text for opportunity statement, pitch summary; CSV for tabular data; JSON for workspace)
- Prototype disclaimer on all exports

### Cross-Cutting
- Toast notifications (success, error, warning, info) with auto-dismiss
- Responsive design with mobile navigation menu
- Prototype banner (dismissible per session)
- Step indicator showing workflow progress
- Loading spinners during generation operations
- Empty states with call-to-action buttons
- Accessible with ARIA attributes, keyboard navigation, and focus management

## Deployment

### Vercel

The project includes a `vercel.json` configuration for SPA routing. Deploy directly from the repository:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The `vercel.json` rewrites all non-asset routes to `index.html` for client-side routing support.

### Static Hosting

Build the project and serve the `dist/` directory with any static file server. Ensure all routes are rewritten to `index.html` for SPA routing:

```bash
npm run build
npx serve dist
```

For Nginx, add a fallback rule:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Known Limitations

- **No Backend / No Server Persistence** — All data is stored in browser localStorage. Data is lost if the user clears browser storage or switches browsers/devices.
- **No Authentication** — There is no user authentication or authorization. The application is single-user.
- **No Real AI/LLM Integration** — All generated content (opportunity statements, personas, concepts, scoring, backlogs, summaries) uses template-based interpolation with randomized mock data. Scores are simulated, not computed by a model.
- **localStorage Size Limits** — Browser localStorage is typically limited to ~5–10 MB. Large numbers of workspaces with extensive backlog data may approach this limit.
- **No Collaboration** — Workspaces cannot be shared between users or devices.
- **No Undo/Redo** — Edits and deletions are immediate and cannot be undone.
- **No Offline Support** — The application requires an initial page load from the server (no service worker or PWA support).
- **Prototype Styling** — Brand assets (logos, official color codes) are placeholders. The `VITE_BRAND_MODE=givaudan` option uses placeholder brand colors that should be replaced with official assets.
- **No PDF Export** — Export is limited to CSV, JSON, and clipboard. PDF report generation is not implemented.
- **No Real-Time Trend Data** — Trend data is static and based on predefined categories. There is no integration with external trend intelligence APIs or social listening platforms.
- **Scoring Weights Are Global** — Scoring weight configuration applies globally across all workspaces, not per-workspace.
- **No Drag-and-Drop Reordering** — Backlog items display a drag handle placeholder but reordering is not implemented.

## Scripts Reference

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Vite development server with HMR |
| `build` | `npm run build` | Build production bundle to `dist/` |
| `preview` | `npm run preview` | Preview production build locally |
| `test` | `npm test` | Run all tests once with Vitest |
| `test:watch` | `npm run test:watch` | Run tests in watch mode |
| `lint` | `npm run lint` | Lint all `.js` and `.jsx` files with ESLint |

## License

Private