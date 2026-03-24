# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LapServ Pro is a laptop service center management application built with React + Vite. It handles service order tracking, damage prediction, parts inventory, technician management, invoicing, and reporting for a laptop repair shop. All UI text is in Indonesian (Bahasa Indonesia).

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

```
src/
  main.jsx              # Entry point, renders App into #root
  App.jsx               # Root component — routing via active state, ErrorBoundary wrapper
  data/constants.js     # All static data (parts catalog, services, damage predictions, technicians, status config, seed orders)
  utils/format.js       # Currency formatting (fmt), HTML escaping (escapeHtml)
  utils/order.js        # Shared order logic: calcOrderTotal (used by 4+ pages), genOrderId (collision-safe)
  hooks/useOrders.js    # Order state management hook (addOrder, updateStatus)
  styles/theme.js       # Centralized design tokens (colors, fonts) and reusable style objects
  components/           # Reusable UI: Sidebar, StatCard, StatusBadge, ProgressTracker, SeverityBadge, ErrorBoundary
  pages/                # Page components: Dashboard, Orders, NewOrder, Predict, Parts, Technicians, Invoice, Report
```

- **No backend** — all state is in-memory via React `useState`. Seed data in `INITIAL_ORDERS`.
- **Inline styles** using theme tokens from `styles/theme.js`. Fonts loaded from Google Fonts (Outfit, DM Sans, DM Mono).
- **Order IDs** generated as `SRV-{year}-{NNN}` via `genOrderId()` which parses existing IDs to avoid collisions.

### Service Order Workflow

Orders follow a status pipeline: antrian → diagnosa → menunggu_part → dikerjakan → testing → selesai (or dibatalkan). Status transitions managed via `useOrders.updateStatus()`.

### Key Conventions

- Shared order cost calculation is centralized in `calcOrderTotal()` — returns `{ svcCost, partCost, total }`.
- Invoice printing uses `escapeHtml()` to sanitize user input before `document.write()`.
- The original monolithic file `laptop-service-center.jsx` is preserved but no longer used.
