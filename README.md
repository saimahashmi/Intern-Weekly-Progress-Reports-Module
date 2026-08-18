# SafeX Intern Management System - Weekly Progress & Reports Module

A corporate, performance-optimized, fully-responsive reporting dashboard module for tracking intern task progress, log hours, weekly progress reports, CRUD task operations, completion analytics, and exporting professional reports in **PDF, CSV, or Excel** formats. Built with **Vanilla HTML5, CSS3, and ES6+ JavaScript**, targeting **Google Lighthouse 90+ Performance**.

---

## ⚡ Performance Optimizations (Lighthouse 90+ Target)

### 1. 🚀 On-Demand Lazy Loading (~97 KiB Unused JS Saved)
- **Zero Heavy Library Overhead on Initial Load**: `jsPDF`, `html2canvas`, and `jsPDF-AutoTable` are completely removed from the initial HTML document payload.
- **Dynamic Script Injection**: Clicking "Download PDF" for the first time triggers `loadScript()` to dynamically inject script tags into `document.head` via Promises.
- **State Caching**: Subsequent PDF downloads generate instantly without re-fetching CDN scripts.
- **Offline Error Handling**: Catches network/offline errors gracefully and displays a user-friendly toast message.

### 2. ⚡ Non-Blocking Main-Thread Rendering
- **Instant First Contentful Paint (FCP)**: Primary table rendering and KPI summary stats render synchronously without main-thread blockage.
- **Deferred Chart Rendering**: `Chart.js` bar chart initialization is scheduled using `requestAnimationFrame()`, allowing the page to become interactive immediately.

---

## 🌟 Features Overview

### 1. 🛡️ SafeX Corporate Brand Identity
- Custom **SafeX** logo badge and wordmark integrated into the header.
- Professional blue/teal corporate palette (`#0284c7`, `#0ea5e9`, `#0369a1`) with full Light and Dark theme adaptation.
- Accessible text contrast meeting WCAG AAA guidelines and clean typography using Google Fonts Inter.

### 2. 📈 Completion Overview Chart (Chart.js)
- Responsive **Completion Rate (%) Bar Chart** displayed above the table.
- Calculation: `Completed tasks in week ÷ Total tasks in week × 100`.
- **Real-Time Live Updates**: Dynamically recalculates whenever tasks are added, edited, deleted, or filtered.
- **Theme Adaptive**: Automatically updates chart text, gridlines, and bar background colors when switching between Light and Dark mode.

### 3. 📄 Branded PDF Export (jsPDF + html2canvas + AutoTable)
- **"Download PDF"** button generates a clean PDF document (`SafeX-Intern-Report-[YYYY-MM-DD].pdf`).
- Includes **SafeX header banner**, date metadata, completion stats summary, high-resolution chart screenshot, and a multi-page table formatted via `jspdf-autotable`.
- Non-blocking button loading state ("Loading libraries..." / "Generating PDF...") and toast feedback.

### 4. 📄 Client-Side Pagination
- Default **10 rows per page** with selector options for **10 / 25 / 50** rows per page.
- Clean Previous / Page Numbers / Next navigation controls below the table.
- Automatically resets to Page 1 on any filter, search, or row limit change.
- Bypassed in Print mode so full datasets can be printed natively.

### 5. 🖨️ Print-Friendly CSS (`@media print`)
- Clean `@media print` stylesheet for browser native printing (Ctrl+P / Cmd+P).
- Automatically hides filter toolbars, action buttons, pagination controls, theme switchers, and toasts.
- Displays full un-paginated table with ink-friendly black-and-white contrast and `page-break-inside: avoid` rules.

### 6. ✏️ Full CRUD Operations & Single-Arrow Sorting
- **+ Add Task** & **Edit Task**: Form modal with validation for Task Name, Status, Hours Spent >= 0, Week Number, and Notes.
- **Delete Task**: Confirmation popup ("Are you sure you want to delete this task?") before removal.
- **Single-Arrow Sorting**: Unsorted column headers remain clean; only the active sorted column displays `▲` (Ascending) or `▼` (Descending).

### 7. 📥 CSV & Excel Scope Exports
- Export **All Weeks** or a **Specific Week** (Week 1, Week 2, Week 3, Week 4).
- Export as **CSV (.csv)** with UTF-8 BOM or **Excel (.xls)** with auto-fit column widths based on text length.

## ⚡ Performance & Quality

Audited with Google Lighthouse (Mobile):

| Category         | Score   |
|-------------------|---------|
| Performance        | 93 |
| Accessibility       | 94 |
| Best Practices      | 100 |
| SEO                 | 100 |

Achieved through lazy-loading of PDF export libraries (jsPDF, html2canvas, jsPDF-AutoTable — loaded only on first "Download PDF" click), deferred Chart.js initialization, and cleanup of unused CSS.

**Browser Testing:** Verified on Google Chrome (desktop and mobile viewport emulation).

---

## 📁 Project File Structure

```
Intern Management System - Weekly Progress & Reports Module/
├── index.html          # HTML5 layout, SafeX header, Chart.js canvas section, & accessibility ARIA tags
├── css/
│   └── style.css       # SafeX theme custom properties, Chart card, pagination, & @media print styles
├── js/
│   └── app.js          # App state, dynamic script loader, Chart.js manager, PDF generator, & pagination
├── sample-data.js      # Array of 16 initial intern task objects
└── README.md           # Documentation & instructions
```

---

## 🚀 How to Run

1. **No Build Tools Required**: Zero build setup or local server installation needed.
2. **Dynamic CDN Fetch**: Chart.js loads asynchronously. Heavy PDF export libraries (`jsPDF`, `html2canvas`, `jsPDF-AutoTable`) load dynamically on-demand when clicking "Download PDF".
3. **Open directly**: Double-click `index.html` or open it directly in any modern browser (Chrome, Firefox, Edge, Safari).

---

## 🛠️ Tech Stack

- **HTML5**: Semantic structure (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`), accessibility ARIA attributes.
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, Media Queries, `@media print`.
- **Vanilla JavaScript (ES6+)**: `loadScript` Promises, state management, DOM manipulation, Blob API, `localStorage`.
- **Dynamic CDN Libraries**:
  - **Chart.js** (v4.4.1) — Deferred bar chart rendering
  - **jsPDF** (v2.5.1) & **jsPDF-AutoTable** (v3.5.31) — Lazy-loaded PDF generation
  - **html2canvas** (v1.4.1) — Lazy-loaded chart canvas rendering
