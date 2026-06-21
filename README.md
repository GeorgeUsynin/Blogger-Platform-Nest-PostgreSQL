# 🚀 Blogs NestJs API

A backend blogging platform built with **NestJS + TypeScript**

The system supports full blogging functionality including authentication, email confirmation, posts, comments, likes, and device session management.

It uses **PostgreSQL (TypeORM)** and follows **Clean Architecture + DDD + CQRS** principles.

---

## ✨ Core Features

- 🔐 Authentication & authorization (JWT-based)
- 📩 Registration with email confirmation
- 🔑 Login / logout with access + refresh token flow
- 🍪 Secure refresh tokens via httpOnly cookies
- ♻️ Password recovery & reset flow
- 📝 Blogs CRUD
- 📰 Posts CRUD (global + nested under blogs)
- 💬 Comments CRUD
- 👍👎 Like / dislike system for posts and comments
- 📱 Security device/session management:
  - list active sessions
  - revoke single device session
  - revoke all sessions except current
- 🛡️ Rate limiting on auth-sensitive endpoints
- 📚 Swagger / OpenAPI documentation
- 🧪 E2E testing (Jest + Supertest)

---

## 🧱 Tech Stack

- Node.js
- TypeScript
- NestJS
- PostgreSQL
- TypeORM
- CQRS (@nestjs/cqrs)
- JWT (@nestjs/jwt)
- bcrypt
- class-validator / class-transformer
- cookie-parser
- Swagger (@nestjs/swagger)
- Jest + Supertest

---

## 🏗️ Architecture

Built using:

- Clean Architecture
- Domain-Driven Design (DDD)
- CQRS

Each feature is isolated.

### Feature structure

src/modules/<feature>/
  api/
  application/
  domain/
  infrastructure/

### CQRS model

- Commands → write operations

---

## 🔐 Authentication Model

- Access token: 1h, Bearer header
- Refresh token: httpOnly cookie, 2h
- Device sessions stored in DB

---

## 🌐 API Routes

/auth
/users
/blogs
/posts
/comments
/devices
/testing

---

## 🚀 Run

npm install
npm run start:dev

---

## 🧪 Tests

npm run test:e2e

---

## 📄 License

ISC
