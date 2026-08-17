# FINANCE

A full-stack personal finance dashboard for tracking income, expenses, and transaction history in one focused workspace.

FINANCE is built with **Next.js**, **TypeScript**, **React**, **Tailwind CSS**, **Chart.js**, and **Supabase**. The application includes authentication, user-scoped transaction storage, dashboard summaries, visual charts, and transaction management.

## Features

- Secure registration and login flows backed by Supabase Auth.
- Personal dashboard with income, expense, and balance summaries.
- Transaction creation, editing, and deletion.
- Income and expense categorisation with dates, notes, and amounts.
- Chart.js visualisations for understanding financial activity.
- Server-side Supabase client support through the Next.js App Router.
- TypeScript database definitions for the `transactions` table.

## Technology

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Next.js 16, TypeScript |
| Styling | Tailwind CSS 4 |
| Data visualisation | Chart.js and `react-chartjs-2` |
| Authentication and persistence | Supabase Auth and Supabase Postgres |
| Quality tooling | ESLint 9, Prettier, TypeScript |

## Local development

### Prerequisites

- Node.js 20 or newer.
- A Supabase project with authentication enabled.
- A `transactions` table matching the types in [`src/lib/database.types.ts`](src/lib/database.types.ts).

### Setup

```bash
git clone https://github.com/abdou1lalmi/FINANCE.git
cd FINANCE
npm install
cp .env.example .env.local
```

Add the following values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |

## Data model

The application currently uses a user-scoped `transactions` table with the following core fields:

| Field | Description |
| --- | --- |
| `user_id` | The authenticated Supabase user who owns the transaction. |
| `amount` | The transaction amount. |
| `category` | A user-facing category such as food, salary, or transport. |
| `type` | Either `income` or `expense`. |
| `date` | The transaction date in ISO format. |
| `note` | An optional note. |

For production deployments, enable Supabase Row Level Security and restrict every transaction operation to the authenticated owner identified by `auth.uid()`.

## Contributing

Issues and pull requests are welcome. Before opening a pull request, run `npm run lint` and `npm run build`, describe the user-facing impact, and include screenshots for visual changes. Please do not commit secrets or real financial information.

## Security and privacy

FINANCE is intended for personal financial tracking. Never commit Supabase service-role keys, exported user data, or credentials. Use the public anon key only in the browser-facing configuration and enforce access control with Supabase Row Level Security policies.

## Status

This project is an actively evolving portfolio application. The roadmap includes stronger automated tests, improved validation and error states, and a documented Supabase migration for reproducible setup.

## License

No license has been declared yet. Until a license is added, reuse and redistribution are not granted by default.

## Author

Built by [abdou1lalmi](https://github.com/abdou1lalmi). See the [GitHub profile](https://github.com/abdou1lalmi) for related projects.
