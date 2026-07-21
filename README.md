# BikeRental - Microservices Based Bike Rental Platform

## Overview

BikeRental is a role-based bike rental platform developed as a CDAC PGCP-AC Final Project. The application follows a Microservices Architecture and supports multiple user roles including Customers, Dealers, and Administrators.

The platform allows customers to discover and rent bikes, dealers to manage their listings and rentals, and administrators to verify registrations and manage disputes.

---

## Features

### Customer

- User Registration and Login
- Browse and Search Bikes
- Book Bikes Online
- Secure Payments
- View Booking History
- Cancel Bookings
- Rate Bikes and Dealers
- Security Deposit Tracking
- Profile Management

### Dealer

- Dealer Registration with Document Verification
- Bike Listing Management
- Rental History Management
- Security Deposit Settlement
- Booking Management
- Customer Review Management

### Admin

- Dealer Approval Workflow
- Bike Approval Workflow
- User Management
- Deposit Dispute Resolution
- Booking Monitoring
- Platform Management

---

## Tech Stack

### Frontend

- React
- Context API
- React Router
- Tailwind CSS

### Backend

- Spring Boot
  - Authentication Service
  - Bike Management Service

- ASP.NET Core
  - Booking Service
  - Payment Management

- Node.js / Express
  - Notification Service
  - Email Service
  - OTP Service

### Database

- PostgresSQL

### Authentication

- JWT Authentication
- Role Based Access Control (RBAC)

### Communication

- REST APIs
- RabbitMQ (Optional)
- API Gateway

---

## User Roles

- Customer
- Dealer
- Administrator

The application uses Role Based Access Control to dynamically provide menus, pages, and permissions based on the authenticated user's role.

---

## Frontend Architecture

```text
src

components/
layouts/
pages/
    customer/
    dealer/
    admin/
    common/

services/
context/
routes/
utils/
constants/
```

---

## Microservices Architecture

```text
                    REACT
                       |
                  API GATEWAY
                       |
        ---------------------------------
        |               |               |
      AUTH            BIKE            BOOKING
    (SPRING)         (SPRING)          (.NET)
        |               |               |
        ---------------------------------
                        |
                   NOTIFICATION
                     (EXPRESS)
                        |
                     EMAIL
                       OTP
```

---

## Database Modules

- User Management
- Customer Management
- Dealer Management
- Bike Management
- Insurance Management
- Booking Management
- Payment Transactions
- Reviews and Ratings
- Deposit Settlement
- Admin Approval Workflow

---

## Future Enhancements

- Razorpay Integration
- RabbitMQ Event Based Communication
- Redis Caching
- Docker Deployment
- Kubernetes Support
- CI/CD Pipeline Integration
- Real Time Notifications

---

## Team Contributions

- Frontend Development
- Backend Microservices Development
- Database Design
- API Integration
- Authentication and Authorization
- Testing and Documentation

---

## License

This project has been developed for academic purposes as part of the CDAC PGCP-AC Final Project.
