# Intern Management System — Weekly Progress & Reports Module

A responsive dashboard for tracking intern task progress, log hours, and weekly reports — with full CRUD, filtering, sorting, and CSV/Excel export. Built with plain **HTML5, CSS3, and Vanilla JavaScript** — no frameworks, no build tools.

---

## Features

- **Progress Table & Summary Cards** — Task, Status, Hours, Notes, Week, and Actions columns, with live KPI stats (Total Tasks, Total Hours, Completed, In Progress). Content is top-aligned and left-aligned for a clean, consistent layout. Converts to a stacked card view on mobile.
- **Full CRUD** — Add / Edit / Delete tasks through a modal form with field validation, plus a confirmation popup before deleting. Table, filters, and stats update instantly after every change.
- **Filters & Search** — Filter by Week and Status, combined with live text search, all from one consolidated top toolbar.
- **Export** — Export as CSV or Excel (.xls), with a choice of All Weeks or a specific week. Excel export auto-fits column widths so long notes are never cut off.
- **Toast Notifications** — Non-blocking bottom-right feedback for add, edit, delete, and export actions (success/error/warning).
- **Light/Dark Theme** — Auto-detects system preference on first load, manual toggle available, and choice is saved via `localStorage`.
- **Fully Responsive** — Optimized for desktop, tablet, and mobile screens.

---

## File Structure

├── index.html
├── css/style.css
├── js/app.js
├── sample-data.js
└── README.md


## How to Run
No installation needed — just open `index.html` in any browser.

## Tech Stack
HTML5 · CSS3 (Custom Properties, Flexbox/Grid) · Vanilla JavaScript (DOM API, Blob API, `localStorage`)

## Author
Saima — Frontend Developer