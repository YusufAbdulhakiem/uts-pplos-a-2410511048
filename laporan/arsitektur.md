# Arsitektur Sistem Booking Property

## Stack Teknologi

| Service          | Framework         | Database            | Port |
| ---------------- | ----------------- | ------------------- | ---- |
| API Gateway      | Node.js + Express | -                   | 3000 |
| Auth Service     | Node.js + Express | auth_db (MySQL)     | 3001 |
| Property Service | Node.js + Express | property_db (MySQL) | 3002 |
| Booking Service  | Laravel           | booking_db (MySQL)  | 8000 |

---

## Justifikasi Pemisahan Service

| Service          | Alasan Pemisahan                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Auth Service     | Menangani autentikasi (JWT & OAuth Google). Digunakan oleh semua service sebagai sumber identitas pengguna.               |
| Property Service | Mengelola data properti (title, lokasi, harga). Dipisahkan karena memiliki domain bisnis sendiri.                         |
| Booking Service  | Mengelola proses booking yang memiliki alur status (pending, confirmed, dll). Dipisahkan untuk fleksibilitas dan scaling. |

---

## Perbandingan dengan Monolitik

| Aspek           | Monolitik                   | Microservice          |
| --------------- | --------------------------- | --------------------- |
| Deployment      | Satu aplikasi               | Tiap service terpisah |
| Scaling         | Semua ikut naik             | Per service           |
| Database        | Satu DB besar               | Tiap service punya DB |
| Fault Isolation | Satu error bisa crash semua | Error terisolasi      |

---

## Peta Routing Gateway

| Method | Path                        | Service    | Keterangan            |
| ------ | --------------------------- | ---------- | --------------------- |
| POST   | /auth/register              | Auth :3001 | Registrasi user       |
| POST   | /auth/login                 | Auth :3001 | Login user            |
| POST   | /auth/refresh               | Auth :3001 | Refresh token         |
| POST   | /auth/logout                | Auth :3001 | Logout                |
| GET    | /auth/me                    | Auth :3001 | Data user             |
| GET    | /auth/oauth/google          | Auth :3001 | Redirect Google OAuth |
| GET    | /auth/oauth/google/callback | Auth :3001 | Callback OAuth        |

---

| Method | Path            | Service        | Keterangan      |
| ------ | --------------- | -------------- | --------------- |
| GET    | /properties     | Property :3002 | List property   |
| POST   | /properties     | Property :3002 | Create property |
| GET    | /properties/:id | Property :3002 | Detail property |
| PUT    | /properties/:id | Property :3002 | Update property |
| DELETE | /properties/:id | Property :3002 | Delete property |

---

| Method | Path          | Service       | Keterangan     |
| ------ | ------------- | ------------- | -------------- |
| GET    | /bookings     | Booking :8000 | List booking   |
| POST   | /bookings     | Booking :8000 | Create booking |
| GET    | /bookings/:id | Booking :8000 | Detail booking |
| PUT    | /bookings/:id | Booking :8000 | Update booking |
| DELETE | /bookings/:id | Booking :8000 | Delete booking |

---

## Flow Sistem

1. Client mengirim request ke API Gateway
2. Gateway memverifikasi JWT
3. Gateway menambahkan header `x-user-id`
4. Request diteruskan ke service tujuan
5. Booking service memanggil property service melalui gateway
6. Data disimpan ke database masing-masing service

---

## Komunikasi Antar Service

* Menggunakan HTTP (REST API)
* Semua komunikasi melalui API Gateway
* Header Authorization diteruskan antar service
* Gateway bertugas sebagai single entry point

---

## Database Separation

Setiap service memiliki database sendiri:

* auth_db → user & token
* property_db → data properti
* booking_db → data booking

Tujuannya:

* menghindari coupling
* meningkatkan scalability
* isolasi data

---

## Kesimpulan

Arsitektur microservices ini memungkinkan:

* scalability per service
* maintenance lebih mudah
* isolasi error
* fleksibilitas pengembangan
