CREATE TABLE IF NOT EXISTS public."Users" (
  "id" BIGSERIAL PRIMARY KEY,
  "login" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
  "deletedAt" TIMESTAMPTZ NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS public."Blogs" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "websiteUrl" TEXT NOT NULL,
  "isMembership" BOOLEAN NOT NULL DEFAULT FALSE,
  "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
  "deletedAt" TIMESTAMPTZ NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS public."Posts" (
  "id" BIGSERIAL PRIMARY KEY,
  "blogId" BIGINT NOT NULL REFERENCES public."Blogs"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
  "deletedAt" TIMESTAMPTZ NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS public."Devices" (
  "deviceId" TEXT PRIMARY KEY,
  "userId" BIGINT NOT NULL REFERENCES public."Users"("id") ON DELETE CASCADE,
  "issuedAt" TIMESTAMPTZ NOT NULL,
  "deviceName" TEXT NOT NULL,
  "clientIp" TEXT NOT NULL,
  "expiresIn" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS public."EmailConfirmations" (
  "userId" BIGINT PRIMARY KEY REFERENCES public."Users"("id") ON DELETE CASCADE,
  "isConfirmed" BOOLEAN NOT NULL,
  "confirmationCode" TEXT NULL,
  "expirationDate" TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public."PasswordRecoveries" (
  "userId" BIGINT PRIMARY KEY REFERENCES public."Users"("id") ON DELETE CASCADE,
  "recoveryCode" TEXT NOT NULL,
  "expirationDate" TIMESTAMPTZ NOT NULL
);
