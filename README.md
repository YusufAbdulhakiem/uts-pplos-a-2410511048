# Sistem Booking Property - UTS PPLOS

Nama: Yusuf Abdulhakiem
NIM: 2410511048
Kelas: A

Sistem booking property berbasis microservices menggunakan API Gateway, JWT Authentication, dan Google OAuth.

---

## Quick Start

### Prerequisites

* Node.js 18+
* PHP 8+
* MySQL
* Composer

---

## Menjalankan Semua Service

Buka 4 terminal:

### 1. Auth Service

cd services/auth-service
npm install
npm run dev

---

### 2. Property Service

cd services/property-service
npm install
npm run dev

---

### 3. Booking Service (Laravel)

cd services/booking-service
composer install
php artisan serve

---

### 4. API Gateway

cd gateway
npm install
npm run dev

---

## Base URL

http://localhost:3000

Semua request dilakukan melalui API Gateway.

---

## Arsitektur

Client
↓
API Gateway (Node.js)

* JWT validation
* Routing request
* Inject header x-user-id

↓
Microservices:

* Auth Service (Node.js)
* Property Service (Node.js)
* Booking Service (Laravel)

↓
Database:

* auth_db
* property_db
* booking_db

---

## Authentication

### Register

POST /auth/register

Body:
{
"name": "User",
"email": "[user@mail.com](mailto:user@mail.com)",
"password": "123456"
}

---

### Login

POST /auth/login

Response:
{
"accessToken": "...",
"refreshToken": "..."
}

---

### Gunakan Token

Tambahkan header:
Authorization: Bearer <accessToken>

---

## Property API

### Create Property

POST /properties

Body:
{
"title": "Kos Jakarta",
"location": "Jakarta",
"price": 1000000
}

---

### Get All Properties

GET /properties

---

### Get Property Detail

GET /properties/{id}

---

### Update Property

PUT /properties/{id}

---

### Delete Property

DELETE /properties/{id}

---

## Booking API

### Create Booking

POST /bookings

Body:
{
"property_id": 1,
"booking_date": "2026-05-01"
}

---

### Get All Bookings

GET /bookings

---

### Get Booking Detail

GET /bookings/{id}

---

### Update Booking

PUT /bookings/{id}

Body:
{
"status": "confirmed"
}

---

### Delete Booking

DELETE /bookings/{id}

---

## Flow Sistem

1. User login dan mendapatkan accessToken
2. Token dikirim ke API Gateway
3. Gateway:

   * memverifikasi JWT
   * menambahkan header x-user-id
4. Request diteruskan ke service terkait
5. Booking service memanggil property melalui gateway
6. Data booking disimpan ke database

---

## Testing

Gunakan Postman:

Flow:

1. Login
2. Create Property
3. Create Booking
4. Get Booking

---

### Test Error

Tanpa token:
→ 401 Unauthorized

Property tidak ditemukan:
→ 400 / 404

---

## Database Schema

### Auth Service

* users
* refresh_tokens
* token_blacklist

---

### Property Service

* properties

  * id
  * user_id
  * title
  * location
  * price

---

### Booking Service

* bookings

  * id
  * user_id
  * property_id
  * booking_date
  * status

---

## Environment Variables

### Gateway (.env)

PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
PROPERTY_SERVICE_URL=http://localhost:3002
BOOKING_SERVICE_URL=http://localhost:8000
JWT_ACCESS_SECRET=your_secret

---

### Auth Service (.env)

PORT=3001
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=auth_db

---

### Property Service (.env)

PORT=3002
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=property_db

---

### Booking Service (.env)

DB_HOST=127.0.0.1
DB_DATABASE=booking_db
DB_USERNAME=root
DB_PASSWORD=

---

