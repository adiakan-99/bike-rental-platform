# BikeRental — Microservices Bike Rental Platform

A role-based bike rental marketplace built as six Spring Boot microservices behind a Spring Cloud Gateway, with a React frontend. Developed as the course-end project for the C-DAC PGCP-AC program.

---

## Architecture

```
                          React 18 + Vite
                                 |
                                 v
                   Spring Cloud Gateway (8080)
                                 |
      +--------+--------+--------+--------+--------+
      |        |        |        |        |        |
    Auth   Customer  Partner    Bike   Booking   Admin
   (8081)   (8082)   (8083)   (8084)   (8085)   (8086)
      |        |        |        |        |        |
   auth_db  cust_db  part_db  bike_db  book_db  admin_db
              (PostgreSQL — one database per service)
```

Services communicate over REST using Spring Cloud OpenFeign. There are no
cross-service database joins — each service owns its own schema and exposes
its data only through its API.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Gateway | Spring Cloud Gateway |
| Services | Spring Boot 4.0.7, Java 17 |
| Persistence | Spring Data JPA / Hibernate, PostgreSQL (Neon) |
| Migrations | Flyway |
| Inter-service | Spring Cloud OpenFeign |
| Security | Spring Security, JWT (HS256) |
| Build | Maven |
| Orchestration | Docker Compose |

---

## Services

| Service | Port | Responsibility |
|---|---|---|
| API Gateway | 8080 | Single browser-facing entry point, routing, CORS |
| Auth | 8081 | Registration, login, JWT issuance, role assignment |
| Customer | 8082 | Customer profiles, KYC details |
| Partner | 8083 | Dealer onboarding, partner profiles, document verification |
| Bike | 8084 | Bike listings, specifications, availability |
| Booking | 8085 | Booking lifecycle, fare calculation, deposit ledger |
| Admin | 8086 | Partner and bike approval workflows, dispute resolution |

---

## Security

Authentication is JWT-based (HS256). The Auth service issues tokens; every
downstream service validates them independently against the shared signing
key — there is no session state anywhere in the system.

Authorization uses role-based access control across five roles:

`CUSTOMER` · `PARTNER` · `ADMIN` · `SUPPORT` · `FINANCE`

Roles are carried as claims in the token and enforced at the controller layer
in each service. The gateway does not make authorization decisions; it routes.

---

## Domain Design Notes

A few decisions worth calling out, since they differ from the obvious approach:

**Availability is a date-range overlap check, not a status flag.** A bike has no
`RENTED` state. Whether it can be booked for a given window is answered by
querying existing bookings for overlapping date ranges. This avoids the classic
bug where a bike stuck in `RENTED` blocks future bookings it shouldn't.

**Fare calculation lives entirely in the Booking service.** No other service
computes money. The Bike service supplies rates; Booking owns the arithmetic
and the resulting record.

**Deposit deductions are an append-only ledger.** Settlements never overwrite a
balance — each deduction is a new row with a reason and amount. The current
balance is derived. This keeps the settlement history auditable and makes
disputes traceable.

**Each service owns its database.** Cross-service data is fetched over HTTP via
Feign, never by joining across schemas. This is slower than a join and
deliberately so — it keeps the service boundaries real.

---

## Running Locally

### Prerequisites
- JDK 17
- Maven 3.9+
- Node.js 18+
- Docker and Docker Compose
- A PostgreSQL instance (the project uses Neon; any Postgres 14+ works)

### Configuration

Each service reads its database URL and the shared JWT secret from environment
variables. Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```
DB_URL_AUTH=jdbc:postgresql://<host>/<db>?sslmode=require
DB_URL_CUSTOMER=...
DB_URL_PARTNER=...
DB_URL_BIKE=...
DB_URL_BOOKING=...
DB_URL_ADMIN=...
DB_USER=...
DB_PASSWORD=...
JWT_SECRET=<shared HS256 signing key>
```

The JWT secret must be identical across all services — Auth signs with it and
every other service verifies with it.

### Start everything

```bash
docker compose up --build
```

Flyway runs migrations on each service at startup.

### Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app is served at `http://localhost:5173` and talks to the gateway at
`http://localhost:8080`.

---

## Repository Layout

```
.
├── api-gateway/
├── auth-service/
├── customer-service/
├── partner-service/
├── bike-service/
├── booking-service/
├── admin-service/
├── frontend/
└── docker-compose.yml
```

Each service directory is a standalone Maven project with its own `pom.xml`,
`Dockerfile`, and Flyway migrations under `src/main/resources/db/migration`.

---

## Roles and Capabilities

**Customer** — register, browse and search bikes, check availability, book,
view rental history, cancel bookings, track security deposit.

**Partner (Dealer)** — onboard with document verification, list and manage
bikes, view bookings against their fleet, settle security deposits.

**Admin** — approve or reject partner registrations and bike listings, manage
users, resolve deposit disputes, monitor bookings.

---

## Status

Built as an academic project and under active development. The core flow —
registration, authentication, bike listing, booking, and the deposit ledger —
is implemented. Some administrative and search paths are still being refined.

---

## License

Developed for academic purposes as part of the C-DAC PGCP-AC course-end project.
