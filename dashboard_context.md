# Bank Mandiri Dashboard Project Context

This document summarizes the changes and features built during our session to create an interactive executive dashboard for Bank Mandiri.

## 1. Dashboard Architecture

We built a single-page React dashboard inside `src/pages/dashboard/views/dashboard.tsx` using `framer-motion` for animations and `recharts` for data visualization. 

The dashboard features a dynamic layout:
- **Default State**: A grid of 6 summary "Metric Cards" displaying high-level KPIs.
- **Expanded State**: Clicking a card transitions it to fill the screen (using Framer Motion `layoutId`), replacing the grid with deep-dive analytical charts specific to that metric.

## 2. Key Metrics & Dynamic Detail Views

We designed specific, data-rich detailed views for each of the 6 core metrics:

1. **Total Assets**
   - *Asset Composition*: Donut Chart mapping distribution (Corporate Loans, Govt Bonds, Retail Loans, Cash).
   - *Yield Analysis*: Bar Chart tracking quarterly yield rates.
   - *Growth Trend*: Line Chart plotting 5-year actual growth vs. target.

2. **Nasabah Prioritas**
   - *AUM Tiers*: Horizontal Bar Chart showing customer brackets by Asset Under Management.
   - *Demographics*: Pie Chart breaking down age groups.
   - *Net Flow*: Stacked Area Chart tracking monthly onboarding vs. churn.

3. **Nasabah Biasa**
   - *Digital Adoption*: Area Chart tracking Livin' by Mandiri MAU vs. dormant users.
   - *Transaction Volume*: Bar Chart mapping daily volume by type (Transfer, QRIS, Top-up, Payment).

4. **Wholesale Loans**
   - *Sector Exposure*: Bar Chart mapping exposure across industries.
   - *Maturity Profile*: Horizontal Bar Chart plotting loan volumes against maturity timelines.
   - *Top Borrowers*: HTML Data Table tracking top corporate clients, internal ratings, limits, and utilization bars.

5. **Non-Performing Loans (NPL)**
   - *NPL by Segment*: Bar Chart breaking down bad loan ratios across segments.
   - *Vintage Analysis*: Line Chart tracking default rates by origination year.
   - *Recovery Status*: Table tracking active recovery efforts (Restructured, Liquidated, Written-off).

6. **Fraud Alerts**
   - *Fraud Typology*: Pie Chart categorizing fraud types.
   - *Geographic Hotspots*: Bar Chart mapping incidents by region.
   - *Resolution SLA*: Line Chart tracking average resolution days vs. 5-day SLA target.

All detailed views include a **Recent Transactions & Events** audit feed at the bottom.

## 3. Brand Styling & Theming

We customized the application to match Bank Mandiri's brand identity, specifically targeting their official primary blue (`#003d79`).

### Files Modified:
- **`src/styles/globals.css`**: Overrode the Tailwind v4 alpha CSS variables (`--color-primary-*` scale) and HeroUI semantic tokens (`--heroui-primary-*` and `--accent`) to use `#003d79`.
- **`tailwind.config.js`**: Updated the standard `blue` color palette so utility classes like `bg-blue-500` accurately map to Mandiri Blue.
- **`dashboard.tsx`**: Updated all Recharts `fill` and `stroke` properties, as well as the global `COLORS` array, to use `#003d79` for data visualization. 

### Notes on Vite & Tailwind v4
During the styling process, we discovered that Tailwind v4 handles the HeroUI plugin natively via `@import "@heroui/styles"` in CSS, meaning the older plugin syntax `import { heroui } from "@heroui/react"` inside `tailwind.config.js` causes Vite dev server crashes. We resolved this by relying purely on CSS variables for HeroUI theming.
