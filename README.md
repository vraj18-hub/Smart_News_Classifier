# Smart News Classifier

**Signal Desk** is a news-intelligence workspace for analyzing articles and exploring their topics, sentiment, and key details. It includes a dashboard and dedicated pages for analysis, article browsing, search, comparison, and article-based Q&A.

## Features

- **Article analysis** — classify articles, assess sentiment, and extract keywords, entities, topics, and summaries.
- **Dashboard** — view news-analysis information at a glance.
- **Article library** — browse saved articles and analysis results.
- **Semantic search** — find relevant news using natural-language queries.
- **Article comparison** — compare articles for similarities.
- **Grounded Q&A** — ask questions about an article and get answers based on its content.
- **Responsive interface** — navigate the workspace on desktop or mobile.

## Tech stack

- React and TypeScript
- TanStack Start and TanStack Router
- Tailwind CSS
- Supabase for authentication and data
- Lovable AI Gateway for AI-powered analysis

## Getting started

### Prerequisites

- Node.js and npm
- A configured Supabase project
- Lovable Cloud / AI Gateway credentials for AI-powered features

### Install and run locally

Clone the repository, then install dependencies and start the development server:

```sh
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
npm install
npm run dev
```

Open the local URL printed in your terminal.

### Environment variables

Create a local `.env` file from the example:

**macOS / Linux**
```sh
cp .env.example .env
```

**Windows PowerShell**
```powershell
Copy-Item .env.example .env
```

Fill in the values for your Supabase project and AI Gateway. The main configuration variables are:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL used by the server |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `VITE_SUPABASE_URL` | Supabase URL exposed to the Vite client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key exposed to the Vite client |
| `LOVABLE_API_KEY` | Server-side key for AI Gateway requests |

Some integrations may require additional server-side variables, such as `SUPABASE_SERVICE_ROLE_KEY` or `LOVABLE_DB_MIGRATION_URL`. Set these only when needed by your configuration.

**Never commit `.env` or put private keys in variables prefixed with `VITE_`.** Keep server-only credentials in your local environment or your deployment provider’s secret settings.

## Available scripts

```sh
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run test      # Run tests
npm run lint      # Run ESLint
```

## Project structure

```text
src/
  components/
    news/          # News workspace pages and features
    ui/            # Reusable interface components
  integrations/    # Supabase and Lovable integrations
  lib/             # Shared logic and server functions
  routes/          # TanStack file-based routes
drizzle/           # Database schema and migrations
supabase/          # Supabase project configuration
```

## Security

- Local environment files and common credential files are excluded by `.gitignore`.
- `.lovable/` and `.AI_agent/` project metadata are excluded from Git.
- Do not share or commit service-role keys, API keys, database URLs, or other secrets.
- If a secret is accidentally published, revoke or rotate it immediately.

## License

No license has been specified yet. All rights remain with the copyright holder unless a license is added to this repository.
