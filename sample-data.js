
const initialTaskData = [
  {
    id: 1,
    taskName: "Setup local development environment & SSH keys",
    status: "Completed",
    hoursSpent: 6.5,
    notes: "Configured Git, VS Code, and internal repos; verified access.",
    weekNumber: 1
  },
  {
    id: 2,
    taskName: "Database Schema Design for User Auth",
    status: "Completed",
    hoursSpent: 12.0,
    notes: "Created ER diagrams, table definitions, and initial SQL scripts.",
    weekNumber: 1
  },
  {
    id: 3,
    taskName: "API Endpoint: POST /api/v1/auth/login",
    status: "Completed",
    hoursSpent: 8.5,
    notes: "Implemented JWT token issuance, password hashing (bcrypt), and rate limits.",
    weekNumber: 1
  },
  {
    id: 4,
    taskName: "Write unit tests for authentication module",
    status: "In Progress",
    hoursSpent: 5.0,
    notes: 'Achieved 82% coverage so far; missing "expired token" test cases.',
    weekNumber: 1
  },
  {
    id: 5,
    taskName: "Front-end Dashboard Layout Component",
    status: "Completed",
    hoursSpent: 14.0,
    notes: 'Built navbar, sidebar, and summary cards. Used CSS grid & flexbox.',
    weekNumber: 2
  },
  {
    id: 6,
    taskName: "Integrate Chart.js for Intern Performance Metrics",
    status: "Completed",
    hoursSpent: 9.0,
    notes: 'Rendered weekly activity bar charts; handled "empty state" gracefully.',
    weekNumber: 2
  },
  {
    id: 7,
    taskName: "Bug Fix: Mobile navigation drawer backdrop filter",
    status: "Completed",
    hoursSpent: 3.5,
    notes: "Fixed z-index overlap on iOS Safari and resolved blur flickering.",
    weekNumber: 2
  },
  {
    id: 8,
    taskName: "User Profile Settings Modal & Image Upload",
    status: "In Progress",
    hoursSpent: 7.5,
    notes: 'Working on drag-and-drop file upload; needs client-size validation (max 2MB).',
    weekNumber: 2
  },
  {
    id: 9,
    taskName: "API Endpoint: GET /api/v1/reports/weekly",
    status: "Completed",
    hoursSpent: 11.0,
    notes: 'Added pagination, sorting by date, and status filtering parameters.',
    weekNumber: 3
  },
  {
    id: 10,
    taskName: "CSV Export feature implementation & formatting",
    status: "In Progress",
    hoursSpent: 6.0,
    notes: 'Using Blob API with UTF-8 encoding. Handled quotes "like this" and commas, seamlessly.',
    weekNumber: 3
  },
  {
    id: 11,
    taskName: "Dark Mode & Theme Switching logic",
    status: "Completed",
    hoursSpent: 4.5,
    notes: 'Implemented CSS variables, localStorage toggle, and system prefers-color-scheme listener.',
    weekNumber: 3
  },
  {
    id: 12,
    taskName: "Code Review & Refactoring: Auth Controller",
    status: "Pending",
    hoursSpent: 0.0,
    notes: "Pending senior developer review & security check feedback.",
    weekNumber: 3
  },
  {
    id: 13,
    taskName: "Automated Deployment Pipeline (GitHub Actions)",
    status: "In Progress",
    hoursSpent: 8.0,
    notes: 'Wrote CI workflow for linting, running tests, and building Docker artifacts.',
    weekNumber: 4
  },
  {
    id: 14,
    taskName: "End-to-End Testing with Playwright",
    status: "Pending",
    hoursSpent: 0.0,
    notes: "Scheduled for sprint completion; setup initial test spec template.",
    weekNumber: 4
  },
  {
    id: 15,
    taskName: "Sprint Retrospective & Mid-Term Progress Demo",
    status: "Pending",
    hoursSpent: 2.0,
    notes: "Prepared slide deck, demo recording, and weekly task breakdown.",
    weekNumber: 4
  },
  {
    id: 16,
    taskName: "Documentation: API Reference & Setup Guide",
    status: "In Progress",
    hoursSpent: 4.5,
    notes: 'Updating README.md and Swagger docs for new endpoints.',
    weekNumber: 4
  }
];
