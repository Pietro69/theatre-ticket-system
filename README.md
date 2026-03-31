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

## Screenshots

> *Coming soon*

---

## Authors

Peter Vojtík 
Dominik Kontrik 
