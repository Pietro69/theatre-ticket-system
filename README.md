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
### Home Page
<img width="1914" height="908" alt="image" src="https://github.com/user-attachments/assets/d4cbc5b6-5ca2-4409-81ab-ff18e0610a37" />

### Show Catalog
<img width="1914" height="909" alt="image" src="https://github.com/user-attachments/assets/67b9fbc0-1b0c-4e3f-9d7f-6c0b51498cf1" />
### Interactive Seat Map
<img width="1914" height="908" alt="image" src="https://github.com/user-attachments/assets/4ee0662f-6717-42fc-832d-32a108c5d850" />
### Reservation Confirmed 
<img width="1913" height="910" alt="image" src="https://github.com/user-attachments/assets/ce8a5645-db8e-437b-93ee-07474bd51e3d" />
### My Reservations
<img width="1916" height="909" alt="image" src="https://github.com/user-attachments/assets/16b77fa3-297d-4bb7-8523-444fef423112" />


---

## Authors

Peter Vojtík 

