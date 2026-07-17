
-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE userRole AS ENUM (
    'USER',
    'ADMIN'
);

CREATE TYPE orderStatus AS ENUM (
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE "users" (
    "ID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR NOT NULL UNIQUE,
    "password" TEXT,
    "firstName" VARCHAR NOT NULL,
    "lastName" VARCHAR NOT NULL,
    "role" userRole NOT NULL DEFAULT 'USER',
    "provider" TEXT,
    "providerID" TEXT,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- PRODUCTS
-- =====================================================

CREATE TABLE "products" (
    "ID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "price" NUMERIC(10,2) NOT NULL CHECK ("price" >= 0),
    "images" JSONB,
    -- productImages
    -- url
    -- altText
    "description" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT FALSE,
    "discount" NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK ("discount" BETWEEN 0 AND 100),
    "isSeasonal" BOOLEAN NOT NULL DEFAULT FALSE,
    "stock" BIGINT NOT NULL DEFAULT 0 CHECK ("stock" >= 0),
    "category" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- CARTS
-- =====================================================

CREATE TABLE "carts" (
    "ID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userID" UUID NOT NULL,
    "productID" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1 CHECK ("quantity" > 0),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fkCartUser
        FOREIGN KEY ("userID")
        REFERENCES "users" ("ID")
        ON DELETE CASCADE,

    CONSTRAINT fkCartProduct
        FOREIGN KEY ("productID")
        REFERENCES "products" ("ID")
        ON DELETE CASCADE,

    CONSTRAINT uniqueCartItem
        UNIQUE ("userID", "productID")
);

-- =====================================================
-- ORDERS
-- =====================================================

CREATE TABLE "orders" (
    "ID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userID" UUID,
    "userEmail" TEXT,
    "items" JSONB NOT NULL,
    "total" NUMERIC(10,2) NOT NULL CHECK ("total" >= 0),
    "status" orderStatus NOT NULL DEFAULT 'PROCESSING',
    "paymentID" TEXT,
    "razorpayOrderID" TEXT,
    "shippingAddress" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "shippedAt" TIMESTAMPTZ,
    "deliveredAt" TIMESTAMPTZ,
    "cancelledAt" TIMESTAMPTZ,

    CONSTRAINT fkOrdersUser
        FOREIGN KEY ("userID")
        REFERENCES "users" ("ID")
        ON DELETE SET NULL
);

-- =====================================================
-- ADDRESSES
-- =====================================================

CREATE TABLE "addresses" (
    "ID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userID" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "street2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isDefault" BOOL DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fkAddressUser
        FOREIGN KEY ("userID")
        REFERENCES "users" ("ID")
        ON DELETE CASCADE
);

-- =====================================================
-- FAVORITES
-- =====================================================

CREATE TABLE "favorites" (
    "ID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userID" UUID NOT NULL,
    "productID" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fkFavoriteUser
        FOREIGN KEY ("userID")
        REFERENCES "users" ("ID")
        ON DELETE CASCADE,

    CONSTRAINT fkFavoriteProduct
        FOREIGN KEY ("productID")
        REFERENCES "products" ("ID")
        ON DELETE CASCADE,

    CONSTRAINT uniqueFavorite
        UNIQUE ("userID", "productID")
);

-- =====================================================
-- PIN CODES
-- =====================================================

CREATE TABLE "pinCodes" (
    "ID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "pinCode" TEXT NOT NULL,
    "officeName" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "block" TEXT,
    "delivery" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uniquePinCodeOffice
        UNIQUE ("pinCode", "officeName")
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE UNIQUE INDEX idxDefaultAddress
ON "addresses" ("userID")
WHERE "isDefault" = TRUE;

CREATE INDEX idxProductsName
ON "products" ("name");

CREATE INDEX idxProductsSlug
ON "products" ("slug");

CREATE INDEX idxProductsSearch
ON "products"
USING GIN (to_tsvector('english', "name"));

CREATE INDEX idxProductsCategory
ON "products" ("category");

CREATE INDEX idxProductsFeatured
ON "products" ("featured");

CREATE INDEX idxCartUser
ON "carts" ("userID");

CREATE INDEX idxCartProduct
ON "carts" ("productID");

CREATE INDEX idxOrdersUser
ON "orders" ("userID");

CREATE INDEX idxOrdersStatus
ON "orders" ("status");

CREATE INDEX idxOrdersCreated
ON "orders" ("createdAt" DESC);

CREATE INDEX idxAddressesUser
ON "addresses" ("userID");

CREATE INDEX idxFavoritesUser
ON "favorites" ("userID");

CREATE INDEX idxFavoritesProduct
ON "favorites" ("productID");

CREATE INDEX idxPinCodes
ON "pinCodes" ("pinCode");
