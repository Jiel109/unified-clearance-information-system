# Unified Clearance Information System
A web-based clearance and document processing prototype that streamlines document requests, centralizes clearance endorsements across participating departments.

## Project Directory Structure

```text
unified-clearance-information-system/
├── index.html                  # HTML entry point with meta tags and root mount
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configurations
├── vite.config.ts              # Vite configuration with React & Tailwind plugins
│
└── src/
    ├── main.tsx                # Mounts React DOM to the #root element
    ├── App.tsx                 # Root coordinator managing auth state, tabs, & modal hooks
    ├── index.css               # Global stylesheets and Tailwind CSS directives
    │
    ├── types/
    │   └── index.ts            # TypeScript interfaces (Roles, StudentProfile, Requests, Statuses)
    │
    ├── services/
    │   └── mockDataService.ts  # Singleton data service handling in-memory dummy records & updates
    │
    ├── components/
    │   ├── Navbar.tsx          # Top navigation bar, session indicators, and role sign-out
    │   ├── StatusBadge.tsx     # Color-coded badges for clearance & request states
    │   ├── ProfileModal.tsx    # Modal for viewing student info and editing contact/notes
    │   ├── RequestModal.tsx    # Modal for selecting documents & filing requests
    │   └── ConfirmationModal.tsx # Acknowledgment popup after request submission
    │
    └── pages/
        ├── LoginPage.tsx              # Dedicated login portal with 7-role selector
        ├── StudentDashboard.tsx       # Student Portal: Request history and live clearance inspection
        ├── DepartmentClearancePage.tsx# Department Console: Approvals and obligation holds
        ├── RegistrarDashboardPage.tsx # Registrar Desk: Consolidated cross-department read-only audit
        └── SchedulingPage.tsx         # Scheduling Subsystem: Pick-up slots and rescheduling
```

---

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure **Node.js** (v18 or higher) and **npm** are installed on your machine.

### 2. Installation
```bash
# Clone or navigate to the project directory
cd unified-clearance-information-system

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 👥 Demo Role Testing Guide

On the Login screen, choose any role from the dropdown:
* **Student:** `lopez.368966@caloocan.sti.edu.ph`
* **Registrar:** `REG-01`
* **Library:** `LIB-02`
* **Accounting:** `ACC-01`
* **Guidance Office:** `GUID-01`
* **MIS:** `MIS-01`
* **Student Affairs:** `OSA-01`
