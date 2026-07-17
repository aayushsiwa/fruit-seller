# Fruit Seller 🍎🍊🍇

An enterprise-grade, fullstack e-commerce application specializing in fresh organic fruits. Built with a modern monolithic architecture utilizing Next.js (Page Router), NextAuth.js, PostgreSQL via Supabase, Material UI, and Razorpay payment integration. It represents a fully tested, production-ready implementation designed for real-world reliability, beautiful UX, and scalable codebase patterns.

---

## 🌟 High-Level Architecture & Tech Stack

This project is built from the ground up to showcase clean code architecture, robust type safety, test-driven reliability, and gorgeous modern design guidelines.

| Layer                  | Technologies & Services                                   | Details                                                                                                      |
| :--------------------- | :-------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **Frontend UI/UX**     | React 18, Next.js, Material UI (MUI v5/v9), Framer Motion | Fully responsive, custom transitions, animations, accessibility, and fluid dark/light/system theme switcher. |
| **Backend API**        | Next.js Serverless API Routes                             | Clean separation of concerns with custom middlewares, validation schemas, and database interaction layers.   |
| **Database & Storage** | PostgreSQL via Supabase                                   | Relational data integrity, complex indexing, constraint safety, and scalable tables.                         |
| **Authentication**     | NextAuth.js (JWT, Credentials, Google OAuth)              | Multi-auth support, protected router layers, role-based authorization (USER, ADMIN).                         |
| **Payments Gateway**   | Razorpay SDK & Server-side Verification                   | Secure signature validation, server-side transaction mapping, and state management.                          |
| **Form Management**    | Formik + Yup Validation                                   | Precise, immediate client-side and server-side schema verification.                                          |
| **Testing & Quality**  | Vitest, React Testing Library, ESLint, Prettier           | 325+ tests covering components, hooks, auth state, and snapshots.                                            |

---

## 🚀 Key Features

### 🛒 Complete Storefront & Product Browsing

- **Dynamic Catalog**: Full catalog supporting searching, pagination, custom categories, seasonal highlighting, and featured flags.
- **Product Details & Image Carousels**: Multi-image view, rich markdown-ready descriptions, current stock indicators, and custom tags.
- **Responsive Navigation & Cart Drawer**: Interactive side drawers, real-time items counter, and high-performance layout shells.

### 🔐 Secure Identity & Auth Layer

- **Seamless Registration**: Single-flow registration that auto-generates beautiful default avatars using UI Avatars, signs the user in directly, and redirects to home.
- **Robust Credentials & Google Login**: High-security login with credentials provider or simple social SSO.
- **Inline Error Handling**: Fully inline validation alerts instead of disruptive popups.
- **Secure Password Resets**: Flow for resetting passwords securely from account settings.

### 💳 Real-time Cart, Checkout, and Address Management

- **Cart Sync**: Real-time state updates across page navigation.
- **Smart Delivery Addresses**: Multi-address management with automated pincode city & state lookup from official data.
- **Razorpay Checkout Flow**: Safe transaction initialization and server-to-server webhook/payment-mapping flow.
- **Order Tracking**: Complete visual workflow depicting order statuses: `PROCESSING`, `SHIPPED`, `DELIVERED`, and `CANCELLED`.

### 🛡️ Feature-Rich Admin Control Panel

- **Administrative CRM**: View/modify all orders, modify statuses, manage registered users, and edit product catalog.
- **Visual Product Designer**: Add/update products with multiple image URLs and custom prices/metadata dynamically via rich dialogs.

---

## 🛠️ Getting Started

### 1. Prerequisites

Ensure you have Node.js (v18+) and `pnpm` installed on your machine.

### 2. Set Up Environment Variables

Create a `.env.local` file in your root directory based on `.example.env`:

```bash
cp .example.env .env.local
```

Fill in your actual environment credentials:

- **Supabase**: URL and service role key.
- **NextAuth**: App URLs and Google API Client credentials for OAuth.
- **Razorpay**: Public key ID and private API secret.
- **Email Notification API**: Service endpoint and access keys.

### 3. Database Initialization

Use the generated `schema.sql` file to create the tables, indices, and triggers in your Supabase PostgreSQL instance:

```bash
# Execute schema.sql via Supabase console or CLI
```

### 4. Installation & Local Development

Install packages and boot up the development server:

```bash
pnpm install
pnpm dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing & Verification

The project enforces high reliability via an extensive suite of automated unit, integration, and snapshot tests:

```bash
# Run ESLint, Prettier format checking, TypeScript compilation, and all Vitest tests
pnpm run-checks

# Run vitest in interactive watch mode
pnpm test:watch

# Run vitest with code coverage report
pnpm test:coverage

# Update snapshots
pnpm test:snapshots
```

---

## 📁 Directory Structure

```
├── components/          # Reusable React & MUI Components (Buttons, Dialogs, Cards)
├── containers/          # Main application page shells (Profile, Cart, Shop, Admin)
├── entity/              # Strict class boundaries mapping API models to internal types
├── lib/                 # Core utilities, API clients, validation schemas, and database helper functions
├── pages/               # Next.js Pages router (routing structure & Serverless APIs)
├── public/              # Static assets, logos, and placeholders
├── src/                 # Application wrapper (Contexts, Themes, Hooks, Test Utilities)
├── types/               # Clean TypeScript definitions, enums, and utility types
├── vitest.config.ts     # Vitest configuration files
└── pnpm-lock.yaml       # Stable lockfile dependency resolution
```

---

## 📜 License

This project is licensed under the MIT License.
