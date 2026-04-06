# Northstar Finance Dashboard

Northstar Finance Dashboard is a modern single-page financial management interface built with React and Vite. It focuses on clean analytics, transaction visibility, role-aware interactions, and shared global state for a smooth dashboard experience.

## Project Highlights

- Role-based interface with Viewer and Admin modes
- Centralized finance state with React Context
- Global navbar search shared across Dashboard, Transactions, and Insights
- Transaction listing with filtering, sorting, and admin-only create/delete actions
- Charts and spending breakdown visualizations powered by Recharts
- Clean, responsive UI designed for desktop and mobile layouts

## Tech Stack

- React 18
- TypeScript
- Vite 6
- React Router 7
- Tailwind CSS 4
- Recharts
- date-fns

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the local URL shown in the terminal after Vite starts.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- npm run dev: starts the Vite development server
- npm run build: creates an optimized production build
- npm run preview: serves the production build locally

## Project Structure

```text
Financedashboardui/
   public/
      favicon.svg
   src/
      app/
         components/
            layout/
         pages/
            Dashboard.tsx
            Transactions.tsx
            Insights.tsx
            Settings.tsx
         App.tsx
         routes.tsx
      context/
         FinanceContext.tsx
      lib/
         utils.ts
      styles/
         index.css
         tailwind.css
         theme.css
      main.tsx
   index.html
   package.json
   vite.config.ts
```

## State Management Notes

The app uses a single shared context in src/context/FinanceContext.tsx for:

- Active user role
- Transaction dataset and derived totals
- Global search query from the header

This ensures consistent filtering behavior across major pages and avoids disconnected local search state.

## Core Functional Areas

- Dashboard: account summary, trend visuals, recent activity, category insights
- Transactions: table-based transaction management with sort and filters
- Insights: category-level and trend-oriented financial breakdowns
- Settings: user-facing configuration and role-related settings UI

## Submission Notes

- Includes a custom Northstar favicon and title branding
- Template/import artifacts and unused generated files were removed
- Global navbar search is wired through shared context to core pages

## License

This project is intended for evaluation and task submission purposes.
