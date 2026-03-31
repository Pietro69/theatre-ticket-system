# Klára — Theatre Ticket Booking System

A full-stack web application for browsing theatre shows, booking seats, and managing reservations — with Stripe payment integration, email notifications, and a complete admin dashboard.

**Live demo:** [klara-divadlo.site](https://www.klara-divadlo.site)

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- React Router v6
- Custom CSS (dark/light theme, fully responsive)

**Backend**
- Java 21 + Spring Boot 3
- Spring Security + JWT-based authentication
- Spring Data JPA + Hibernate
- PostgreSQL (hosted on Neon)

**Integrations**
- Stripe — payment processing + webhook handling
- JavaMail — transactional email (reservation confirmation, payment receipt)

**Infrastructure**
- Backend: [Railway](https://railway.app)
- Frontend: [Vercel](https://vercel.com)
- Database: [Neon](https://neon.tech) (serverless PostgreSQL)

---

## Features

### For users
- Browse theatre shows with genre filtering
- View upcoming performances with date and time
- Interactive seat map — select one or multiple seats in real time
- Stripe-powered checkout with automatic reservation expiry (2 hours)
- Email confirmation with a direct payment link
- Account management — view, pay, or cancel reservations
- Email verification on registration
- Dark / light theme toggle

### For admins
- Full admin dashboard — manage shows, performances, halls, and seats
- Reservation overview with status tracking (Pending / Paid / Cancelled / Expired)
- Statistics page — revenue, sold tickets, occupancy rate, top shows by bookings
- Export all reservations to CSV

---

## Architecture

```
theatre-ticket-system/
├── backend/
│   └── src/main/java/com/theatre/backend/
│       ├── controller/       REST API endpoints
│       ├── service/          Business logic
│       ├── repository/       JPA repositories
│       ├── entity/           Database entities
│       ├── dto/              Request / Response DTOs
│       ├── exception/        Custom exceptions + global handler
│       └── config/           Security, CORS, mail configuration
│
└── frontend/
    └── src/
        ├── api/              Typed API client + response types
        ├── context/          Global auth state (React Context)
        ├── components/       Nav, Footer, Auth modals
        └── pages/            All page components + admin panel
```

---

## Key Flows

**Booking flow**
```
Browse shows → Select performance → Interactive seat map
→ Login / Register → Confirm reservation
→ Email with payment link → Stripe checkout → Paid confirmation email
```

**Admin flow**
```
Admin login → Dashboard → Manage shows / performances / halls / seats
→ View all reservations → Export CSV → Statistics overview
```

---

## REST API Overview

| Resource | Endpoints |
|---|---|
| Shows | `GET /api/shows`, `GET /api/shows/{id}`, `POST`, `PUT`, `DELETE` |
| Performances | `GET /api/performances`, `GET /api/performances/show/{showId}` |
| Seats | `GET /api/seats/hall/{hallId}`, `GET /api/performances/{id}/seats` |
| Reservations | `GET`, `POST /api/reservations`, `DELETE /api/reservations/{id}/cancel` |
| Auth | `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/verify` |
| Payments | `POST /api/payments/checkout/{reservationId}`, `POST /api/payments/webhook` |
| Users | `GET /api/users/{id}/reservations` |

---

## Local Development

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL database (or use the Neon connection string)

### Backend

```bash
cd backend
# Set environment variables (or create application-local.yaml):
# DATABASE_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
# MAIL_USERNAME, MAIL_PASSWORD, FRONTEND_URL

./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
# Vite proxies /api/* to localhost:8080
```

---

## Environment Variables

### Backend (Railway)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `MAIL_USERNAME` | SMTP email address |
| `MAIL_PASSWORD` | SMTP password |
| `APP_FRONTEND_URL` | Frontend URL for email links and CORS |

### Frontend (Vercel)
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |

---

## Screenshots

> *Coming soon*

---

## Authors

Built as a portfolio project.
