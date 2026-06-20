# Temple Management System 3.0

A full-stack MERN platform for temple administration — donation management, appointment scheduling, event coordination, and community engagement — containerized with Docker and backed by a >90% test suite.

![Coverage](https://img.shields.io/badge/coverage-%3E90%25-brightgreen) ![Tests](https://img.shields.io/badge/tests-Supertest%20%2B%20Cypress-blue) ![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white) ![Stack](https://img.shields.io/badge/stack-MERN-339933)

---

## Overview

Temple Management System 3.0 is an integrated platform that consolidates the operational workflow of religious institutions into a single web application. The system supports temple administrators in managing donations, coordinating events, scheduling appointments, tracking visitors, and engaging with the community — replacing fragmented spreadsheets, paper records, and ad-hoc tools.

The project began as an academic group deliverable (Software Engineering, Fall 2024) and was  extended afterward into a production-grade build with comprehensive testing, containerization, and deployment.

## What's New in v2

This version is an upgradation over the original v1 (preserved on the `legacy-v1` branch):

- **Comprehensive test suite** — backend integration tests with Supertest and end-to-end UI tests with Cypress, achieving **>90% coverage** across critical service paths.
- **Containerization** — Docker-based runtime with helper scripts (`start-containers.sh`, `stop-containers.sh`) for one-command spin-up of the full stack.
- **Cloud deployment** — packaged and deployed to Heroku with environment-driven configuration.
- **Bug fixes** — resolved data-consistency, validation, and UI issues identified during testing.

## Features

- **Donation Management** — track contributions, generate receipts, and view donor history
- **Event Coordination** — create, publish, and manage event registrations
- **Appointment Scheduling** — booking system for visitor appointments
- **Subscription Module** — recurring services and member subscriptions
- **Visitor Portal** — community-facing dashboard and announcements
- **Admin Dashboard** — operational metrics and management controls

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App) |
| Backend | Node.js, Express |
| Database | MongoDB |
| Backend Testing | Supertest |
| E2E Testing | Cypress |
| Containerization | Docker |
| Deployment | Heroku |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or hosted, e.g. MongoDB Atlas)
- Docker (optional, for containerized runs)

### Clone

```bash
git clone https://github.com/Adit0717/Temple_Management_3.0.git
cd Temple_Management_3.0
```

### Environment

Create a `.env` file inside `server/` with the following variables (the file is gitignored), the values are not included:

```env
MONGO_URI=<mongodb-connection>
PORT=<backend-port>
JWT_SECRET=<jwt-secret>
```

### Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Run locally

```bash
# Backend (from /server)
node server.js

# Frontend (from /client, in a separate terminal)
npm start
```

### Run with Docker

```bash
# From repo root
./start-containers.sh    # boots backend + frontend containers
./stop-containers.sh     # tears them down cleanly
```

## Testing

```bash
# Backend integration tests (Supertest)
cd server
npm test

# End-to-end tests (Cypress)
cd client
npx cypress open    # interactive runner
npx cypress run     # headless
```

Coverage exceeds 90% across backend services and critical user-facing flows.

## Project Structure

```
Temple_Management_3.0/
├── client/                  # React frontend (CRA)
├── server/                  # Express backend + tests
├── start-containers.sh      # Docker startup script
├── stop-containers.sh       # Docker teardown script
├── package.json
└── README.md
```

## Branches

- **`main`** — current production-grade build
- **`legacy-v1`** — original Fall 2024 academic submission, preserved for reference

*Originally developed as part of academic coursework ACS56000 (Software Engineering). Extended for ACS56700 with full test coverage, containerization, and deployment.*
