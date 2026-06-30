# Changelog

All notable changes to Market Trend Innovation Studio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2024-01-01

### Added

#### Workspace Management
- Create, edit, and delete innovation workspaces with target region, market segment, trend theme, and strategic goal.
- Dashboard with workspace cards, search, filter by region/segment, and sort options (newest, oldest, name, recently updated).
- Summary statistics on the dashboard: total workspaces, concepts generated, backlogs created, and localStorage usage.
- Workspace detail page with full five-step workflow view and breadcrumb navigation.
- Workspace data persistence via browser localStorage with deep clone safety on all read/write operations.

#### Opportunity Statement Generation
- Auto-generated opportunity statements based on workspace context (region, segment, trend, goal) using template-based interpolation.
- Keyword highlighting for opportunity, business relevance, target segment, region, and unmet need phrases.
- Inline editing with character count, minimum/maximum length validation, and save/cancel controls.
- Copy to clipboard functionality with visual feedback.
- Confidence badge indicator based on input completeness.
- Regenerate button to produce alternative statement phrasings.

#### Persona Generation
- B2B and end-consumer persona profiles generated from workspace context.
- Contextual needs, preferences, decision drivers, and constraints derived from segment, trend, goal, and region inputs.
- Avatar placeholder with persona type badge (B2B / End Consumer).
- Inline editing with editable list sections for all persona attributes.
- Collapsible detail sections for goals, pain points, and behaviors.
- Regenerate button to produce alternative persona profiles.

#### Concept Shortlist Generation
- Generation of 3–5 product concepts per workspace aligned to trend theme and strategic goals.
- Concept cards with value proposition, target user, differentiation, key features, and estimated timeline.
- Selectable checkboxes for shortlisting concepts for backlog generation.
- Sort options: default order, score (high/low), name (A–Z/Z–A), and rank.
- Expandable details showing strategic rationale, evidence notes, and score breakdown.
- Select all / deselect all controls.
- Regenerate all concepts button.

#### Feasibility & Value Matrix
- Sortable scoring matrix table with all six evaluation criteria columns.
- Color-coded score cells (green/amber/red) with tooltip rationale on hover.
- Weighted total calculation using configurable criterion weights.
- Rank badges (#1, #2, #3) and confidence indicators per concept.
- Score legend and hover instruction text.
- Detailed scoring rationale panel with per-criterion breakdown, assessment labels (Exceptional/Strong/Adequate/Below Average/Critical Gap), and weighted contribution display.
- Expand all / collapse all controls for criterion sections.
- Strengths, weaknesses, assumptions, risks, and missing information sections.
- Recommendation narrative based on weighted total thresholds.

#### Scoring Configuration
- Adjustable weights for each of the six scoring criteria via sliders and number inputs.
- Real-time total weight validation enforcing 100% sum constraint.
- Save to localStorage and reset to defaults functionality.
- Visual indicators for modified weights with "Modified" badges.
- Collapsible configuration panel with prototype disclaimer.
- Dedicated scoring configuration page (`/settings/scoring`) with how-it-works guide and tips.

#### Product Backlog Generation
- Hierarchical backlog structure: epics → features → user stories → acceptance criteria.
- One epic per selected concept with 3–8 contextual features per epic.
- User stories following "As a… I want… So that…" pattern with acceptance criteria.
- Priority tagging: MVP, Next Release, Future Enhancement.
- Status management: Idea, Under Review, Approved, In Progress, Completed, Archived.
- Default status assignment based on tag (MVP → Approved, Next Release → Under Review, Future Enhancement → Idea).
- Filter by tag and type (epic/feature/user story).
- Inline editing of backlog item title, description, and tag.
- Tag distribution summary with badge counts.
- Flatten backlog utility for export.
- Backlog summary statistics (counts by type, tag, and status).

#### Executive Pitch Summary
- Structured sections: problem/opportunity gap, market opportunity, target segment, recommended concept, value proposition, feasibility assessment, key risks, and next steps.
- Confidence badge and context badges (region, segment, trend, goal).
- Copy to clipboard and print support.
- Reviewer comment field with character count (max 1,000 characters).
- Expandable additional sections: market context, strategic rationale, assumptions, missing information, and confidence assessment.
- Regenerate button to produce alternative summaries.

#### Assumptions, Risks & Missing Information
- Editable lists for assumptions, risks, and missing information items.
- Add, remove, and inline edit items within each category.
- Collapsible category sections with item counts and color-coded icons.
- Summary footer with category totals and last updated timestamp.

#### Export Capabilities
- Export to CSV for concepts, scoring, and backlog data with proper escaping and header rows.
- Export to JSON for all output types including full workspace export.
- Copy to clipboard: formatted text for opportunity statement and pitch summary; CSV for tabular data; JSON for workspace.
- Prototype disclaimer included on all exports.
- Dropdown export menu component with CSV, JSON, and clipboard options.
- Convenience functions: `exportFullWorkspace`, `exportBacklogToCSV`, `exportConceptsToCSV`, `exportScoringToCSV`, `copyPitchSummaryToClipboard`, `copyOpportunityStatementToClipboard`.

#### Edit & Regenerate Service
- Generic edit dialog component supporting all output types with type-specific field configurations.
- Edit individual outputs (opportunity statement, persona, concepts, backlog items, pitch summary, assumptions, risks, evidence notes).
- Regenerate individual outputs using workspace context.
- Batch edit multiple outputs in a single operation.
- Regenerate all downstream outputs in sequence.

#### Cross-Cutting Features
- Toast notifications (success, error, warning, info) with auto-dismiss timers and manual close.
- Responsive design with mobile navigation menu and breakpoint-aware layouts.
- Prototype banner (dismissible per session) with disclaimer text.
- Step indicator showing five-step workflow progress with completed/current/upcoming states.
- Loading spinners with contextual messages during generation operations.
- Empty states with descriptive messages and call-to-action buttons.
- Reusable UI components: Badge, Button, Card, ConfidenceBadge, EditDialog, EmptyState, ExportMenu, Footer, FormField, Header, LoadingSpinner, Modal, NotificationToast, PrototypeBanner, StepIndicator, Tooltip.

#### Accessibility
- Semantic HTML elements (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`).
- ARIA attributes: `aria-label`, `aria-expanded`, `aria-current`, `aria-sort`, `aria-live`, `aria-modal`, `aria-describedby`, `aria-invalid`, `aria-required`, `aria-busy`, `aria-disabled`, `aria-selected`.
- Keyboard navigation support: focus trap in modals, Escape to close, Enter/Space to activate, Tab cycling.
- Focus management: auto-focus on modal open, restore focus on close, focus on edit inputs.
- Screen reader support with `sr-only` text and `role` attributes (`alert`, `status`, `dialog`, `region`, `button`, `table`, `cell`, `columnheader`, `tooltip`, `menu`, `menuitem`).

#### Testing
- Unit tests for `workspaceManager` service: create, read, update, delete, save, load operations with localStorage persistence validation.
- Unit tests for `conceptEvaluator` service: scoring, ranking, explanation, re-evaluation, comparison, and weight configuration accuracy.
- Unit tests for `backlogGenerator` service: hierarchy generation, tag/status assignment, flattening, and summary statistics.
- Unit tests for `exportService`: CSV, JSON, and clipboard export for all output types with error handling.
- Component tests for `MatrixTable`: rendering, column headers, score display, sorting behavior, tooltip rationale, row click interaction, accessibility, empty state, and loading state.
- Component tests for `WorkspaceForm`: rendering, edit mode pre-population, field validation, successful submission, cancel action, and edge cases.
- Page tests for `DashboardPage`: empty state, workspace listing, summary statistics, navigation, storage usage, and error handling.

#### Infrastructure
- Vite 5 build configuration with React plugin and path aliases.
- Vitest test configuration with jsdom environment and setup file.
- Tailwind CSS 3 with custom brand color palette, typography, spacing, shadows, animations, and responsive utilities.
- PostCSS with Tailwind and Autoprefixer plugins.
- ESLint configuration with recommended rules and JSX support.
- Prettier configuration for consistent code formatting.
- React Router DOM 6 with `createBrowserRouter` and lazy-loaded page components.
- Vercel deployment configuration with SPA routing rewrites.
- Environment variable support via `.env.example` with `VITE_APP_TITLE`, `VITE_APP_VERSION`, and `VITE_BRAND_MODE`.

### Known Limitations

- **No backend / no server persistence** — all data is stored in browser localStorage.
- **No authentication** — single-user application with no access control.
- **No real AI/LLM integration** — all generated content uses template-based interpolation with randomized mock data.
- **localStorage size limits** — browser localStorage is typically limited to ~5–10 MB.
- **No collaboration** — workspaces cannot be shared between users or devices.
- **No undo/redo** — edits and deletions are immediate and cannot be undone.
- **No offline support** — no service worker or PWA support.
- **No PDF export** — export is limited to CSV, JSON, and clipboard.
- **No real-time trend data** — trend data is static and based on predefined categories.
- **Scoring weights are global** — configuration applies across all workspaces, not per-workspace.
- **No drag-and-drop reordering** — backlog items display a drag handle placeholder but reordering is not implemented.
- **Prototype styling** — brand assets (logos, official color codes) are placeholders.