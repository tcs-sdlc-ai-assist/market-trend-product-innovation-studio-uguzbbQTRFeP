# Deployment Guide

> **Market Trend Innovation Studio — Deployment Documentation**

This guide covers deploying Market Trend Innovation Studio to Vercel and other static hosting environments, including environment variable configuration, SPA routing, preview deployments, and CI/CD integration with GitHub Actions.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Build Commands](#build-commands)
4. [Vercel Deployment](#vercel-deployment)
5. [SPA Routing Configuration](#spa-routing-configuration)
6. [Preview Deployments](#preview-deployments)
7. [CI/CD with GitHub Actions](#cicd-with-github-actions)
8. [Alternative Hosting](#alternative-hosting)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or compatible package manager)
- A [Vercel](https://vercel.com) account (for Vercel deployment)
- A GitHub repository (for CI/CD integration)

---

## Environment Variables

All client-side environment variables **must** be prefixed with `VITE_` to be exposed to the application at build time. They are accessed in code via `import.meta.env.VITE_*`.

### Available Variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `VITE_APP_TITLE` | `Market Trend Innovation Studio` | No | Application title displayed in the browser tab and header. |
| `VITE_APP_VERSION` | `1.0.0` | No | Application version string (semver recommended). |
| `VITE_BRAND_MODE` | `placeholder` | No | Brand mode for theming. Options: `placeholder` (generic/unbranded), `givaudan` (branded colors, logos, typography). |

### Setting Up Environment Variables

#### Local Development

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your desired values:

   ```env
   VITE_APP_TITLE=Market Trend Innovation Studio
   VITE_APP_VERSION=1.0.0
   VITE_BRAND_MODE=placeholder
   ```

3. `.env.local` is listed in `.gitignore` and will not be committed to version control.

#### Vercel Dashboard

1. Navigate to your project in the [Vercel Dashboard](https://vercel.com/dashboard).
2. Go to **Settings** → **Environment Variables**.
3. Add each variable with the appropriate value for each environment (Production, Preview, Development).

| Variable | Production | Preview | Development |
|---|---|---|---|
| `VITE_APP_TITLE` | `Market Trend Innovation Studio` | `Market Trend Innovation Studio (Preview)` | `Market Trend Innovation Studio (Dev)` |
| `VITE_APP_VERSION` | `1.0.0` | `1.0.0-preview` | `1.0.0-dev` |
| `VITE_BRAND_MODE` | `placeholder` | `placeholder` | `placeholder` |

#### Vercel CLI

You can also set environment variables via the Vercel CLI:

```bash
vercel env add VITE_APP_TITLE production
vercel env add VITE_APP_VERSION production
vercel env add VITE_BRAND_MODE production
```

#### GitHub Actions

For CI/CD pipelines, set environment variables as GitHub repository secrets or as inline environment variables in the workflow file. See the [CI/CD with GitHub Actions](#cicd-with-github-actions) section for details.

---

## Build Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server with HMR at `http://localhost:5173`. |
| `npm run build` | Build the production bundle to the `dist/` directory. |
| `npm run preview` | Preview the production build locally. |
| `npm test` | Run all tests once with Vitest. |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run lint` | Lint all `.js` and `.jsx` files with ESLint. |

### Production Build

```bash
npm ci
npm run build
```

The production build outputs static files to the `dist/` directory:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── vite.svg
```

### Verifying the Build Locally

```bash
npm run build
npm run preview
```

The preview server starts at `http://localhost:4173` by default.

---

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your repository.
4. Vercel auto-detects the Vite framework. Verify the following settings:

   | Setting | Value |
   |---|---|
   | **Framework Preset** | Vite |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
   | **Install Command** | `npm ci` |
   | **Node.js Version** | 18.x or 20.x |

5. Add environment variables under **Environment Variables** (see above).
6. Click **Deploy**.

Vercel will build and deploy the application. Subsequent pushes to the default branch trigger automatic production deployments.

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally:

   ```bash
   npm i -g vercel
   ```

2. Log in to your Vercel account:

   ```bash
   vercel login
   ```

3. From the project root, run:

   ```bash
   vercel
   ```

4. Follow the prompts to link the project and configure settings.

5. For production deployment:

   ```bash
   vercel --prod
   ```

### Vercel Project Configuration

The project includes a `vercel.json` file that configures SPA routing rewrites:

```json
{
  "rewrites": [
    {
      "source": "/((?!assets/).*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all non-asset routes are rewritten to `index.html` for client-side routing via React Router.

---

## SPA Routing Configuration

Market Trend Innovation Studio uses React Router DOM 6 with `createBrowserRouter` for client-side routing. All routes are defined in `src/router.jsx`:

| Route | Page Component | Description |
|---|---|---|
| `/` | `DashboardPage` | Dashboard with workspace listing |
| `/workspaces` | `DashboardPage` | Alias for dashboard |
| `/workspaces/new` | `CreateWorkspacePage` | Create new workspace |
| `/workspaces/:id` | `WorkspaceDetailPage` | Workspace detail view |
| `/settings/scoring` | `ScoringConfigPage` | Scoring weight configuration |
| `*` | `NotFoundPage` | 404 error page |

### Why SPA Routing Matters

Since this is a single-page application, the server must return `index.html` for all routes that are not static assets. Without this configuration, navigating directly to a route like `/workspaces/abc-123` would result in a 404 error from the hosting server.

### Vercel

The `vercel.json` file handles this automatically. No additional configuration is needed.

### Nginx

If deploying behind Nginx, add the following to your server configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache

Add a `.htaccess` file to the `dist/` directory:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### Netlify

Create a `_redirects` file in the `public/` directory:

```
/*    /index.html   200
```

### Cloudflare Pages

Cloudflare Pages handles SPA routing automatically for single-page applications. No additional configuration is required.

---

## Preview Deployments

Vercel automatically creates preview deployments for every push to a non-production branch and for every pull request.

### How Preview Deployments Work

1. A developer pushes a branch or opens a pull request.
2. Vercel builds the branch and deploys it to a unique preview URL (e.g., `https://market-trend-innovation-studio-git-feature-xyz-yourteam.vercel.app`).
3. The preview URL is posted as a comment on the pull request (if using GitHub integration).
4. Reviewers can test the changes at the preview URL before merging.

### Preview Environment Variables

Preview deployments use environment variables scoped to the **Preview** environment in Vercel. You can set different values for preview deployments (e.g., a different `VITE_APP_TITLE` to distinguish preview from production).

### Branch-Specific Previews

To deploy specific branches to custom domains:

1. Go to **Settings** → **Domains** in the Vercel Dashboard.
2. Add a domain and assign it to a specific Git branch.

### Local Preview

To preview the production build locally without deploying:

```bash
npm run build
npm run preview
```

Or use a static file server:

```bash
npm run build
npx serve dist
```

---

## CI/CD with GitHub Actions

### Basic Build and Test Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          VITE_APP_TITLE: Market Trend Innovation Studio
          VITE_APP_VERSION: ${{ github.sha }}
          VITE_BRAND_MODE: placeholder
```

### Build, Test, and Deploy to Vercel

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          VITE_APP_TITLE: Market Trend Innovation Studio
          VITE_APP_VERSION: 1.0.0
          VITE_BRAND_MODE: placeholder

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./
```

### Required GitHub Secrets for Vercel Deployment

| Secret | Description | How to Obtain |
|---|---|---|
| `VERCEL_TOKEN` | Vercel API token for authentication. | [Vercel Dashboard](https://vercel.com/account/tokens) → Create Token. |
| `VERCEL_ORG_ID` | Your Vercel organization/team ID. | Run `vercel link` locally, then check `.vercel/project.json` for `orgId`. |
| `VERCEL_PROJECT_ID` | Your Vercel project ID. | Run `vercel link` locally, then check `.vercel/project.json` for `projectId`. |

To add secrets to your GitHub repository:

1. Go to your repository on GitHub.
2. Navigate to **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret** and add each secret.

### Pull Request Preview Workflow

Create `.github/workflows/preview.yml`:

```yaml
name: Preview Deployment

on:
  pull_request:
    branches: [main, develop]

jobs:
  preview:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          VITE_APP_TITLE: "Market Trend Innovation Studio (Preview)"
          VITE_APP_VERSION: "1.0.0-pr.${{ github.event.pull_request.number }}"
          VITE_BRAND_MODE: placeholder

      - name: Deploy Preview to Vercel
        uses: amondnet/vercel-action@v25
        id: vercel-deploy
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./

      - name: Comment Preview URL on PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 **Preview Deployment Ready**\n\nURL: ${{ steps.vercel-deploy.outputs.preview-url }}\n\n_This is a preview deployment of commit ${{ github.sha }}._`
            })
```

### Workflow Notes

- **Caching**: The `actions/setup-node@v4` action with `cache: 'npm'` caches `node_modules` based on `package-lock.json` to speed up subsequent runs.
- **Matrix Testing**: The CI workflow tests against Node.js 18 and 20 to ensure compatibility.
- **Environment Variables**: Build-time environment variables are passed via the `env` key in the build step. They are embedded into the JavaScript bundle at build time.
- **Branch Protection**: Consider enabling branch protection rules on `main` to require passing CI checks before merging.

---

## Alternative Hosting

### Static File Server

Build the project and serve the `dist/` directory with any static file server:

```bash
npm run build
npx serve dist
```

### Docker

Create a `Dockerfile` for containerized deployment:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create an `nginx.conf` file:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:

```bash
docker build -t mtis .
docker run -p 8080:80 mtis
```

### AWS S3 + CloudFront

1. Build the project: `npm run build`
2. Upload the `dist/` directory to an S3 bucket configured for static website hosting.
3. Create a CloudFront distribution pointing to the S3 bucket.
4. Configure a custom error response: for 403 and 404 errors, return `/index.html` with a 200 status code.

### GitHub Pages

GitHub Pages does not natively support SPA routing. Use a `404.html` redirect hack:

1. Add a `404.html` file to the `public/` directory that redirects to `index.html` using a JavaScript redirect.
2. Configure the Vite `base` option if deploying to a subpath:

   ```js
   // vite.config.js
   export default defineConfig({
     base: '/your-repo-name/',
     plugins: [react()],
   });
   ```

> **Note**: GitHub Pages is not recommended for this application due to SPA routing limitations.

---

## Troubleshooting

### Common Issues

#### Build Fails with "Cannot find module" Errors

Ensure all dependencies are installed:

```bash
rm -rf node_modules
npm ci
```

#### Routes Return 404 in Production

The hosting server is not configured for SPA routing. Ensure all non-asset routes are rewritten to `/index.html`. See the [SPA Routing Configuration](#spa-routing-configuration) section.

#### Environment Variables Not Available at Runtime

- Verify that all client-side variables are prefixed with `VITE_`.
- Environment variables are embedded at **build time**, not runtime. If you change a variable, you must rebuild the application.
- Verify the variable is set in the correct environment scope (Production, Preview, or Development) in the Vercel Dashboard.

#### Blank Page After Deployment

- Check the browser console for JavaScript errors.
- Verify the `base` option in `vite.config.js` matches the deployment path (default is `/`).
- Ensure the build output includes `index.html` and the `assets/` directory.

#### localStorage Data Not Persisting

- localStorage is scoped to the origin (protocol + domain + port). Preview deployments on different URLs have separate localStorage stores.
- localStorage is limited to approximately 5–10 MB depending on the browser. Check storage usage on the dashboard.
- Private/incognito browsing modes may restrict localStorage access.

#### Tests Fail in CI but Pass Locally

- Ensure the CI environment uses the same Node.js version as local development.
- The `vitest.config.js` uses `jsdom` as the test environment. Verify the `jsdom` package is listed in `devDependencies`.
- Check for timezone-dependent tests — CI servers may use UTC while local machines use a different timezone.

### Vercel-Specific Issues

#### Deployment Stuck or Failing

- Check the **Deployments** tab in the Vercel Dashboard for build logs.
- Verify the **Build Command** is set to `npm run build` and the **Output Directory** is set to `dist`.
- Ensure the **Node.js Version** is set to 18.x or 20.x in project settings.

#### Preview Deployment Not Triggering

- Verify the GitHub integration is connected in the Vercel Dashboard under **Settings** → **Git**.
- Check that the branch is not excluded from deployments in **Settings** → **Git** → **Ignored Build Step**.

#### Custom Domain Not Working

- Verify DNS records are configured correctly (CNAME or A record pointing to Vercel).
- Allow up to 48 hours for DNS propagation.
- Check the **Domains** tab in the Vercel Dashboard for SSL certificate status.

---

## Security Notes

- **No sensitive data in environment variables**: All `VITE_*` variables are embedded in the client-side JavaScript bundle and are visible to anyone who inspects the page source. Never store API keys, secrets, or credentials in `VITE_*` variables.
- **No server-side persistence**: This is a client-side-only application. All data is stored in the browser's localStorage. There is no backend, no database, and no authentication.
- **Prototype disclaimer**: This application is an MVP prototype for demonstration purposes only. It is not intended for production use with real data.

---

## Quick Reference

### Deploy to Vercel (CLI)

```bash
npm ci
npm run lint
npm test
npm run build
vercel --prod
```

### Deploy to Vercel (Dashboard)

1. Push to `main` branch.
2. Vercel auto-deploys.

### Verify Deployment

1. Visit the deployment URL.
2. Navigate to `/workspaces/new` — should render the Create Workspace page (not a 404).
3. Create a workspace and verify data persists across page reloads.
4. Check the browser console for errors.