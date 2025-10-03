# JLearning Monorepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

This workspace is a monorepo managed by [Nx](https://nx.dev) for the JLearning project, a Japanese language learning application.

## ✨ Tech Stack

- **Monorepo:** Nx
- **Backend:** NestJS, Drizzle ORM, Turso (LibSQL)
- **Frontend:** React, Vite, TypeScript, React Router

## 📦 Projects in this Workspace

This monorepo contains the following main applications:

- `jlearning-api`: The backend REST API built with NestJS. It handles business logic and database interactions.
- `jlearning-front`: The frontend application built with React and Vite.
- `jlearning-front-e2e`: End-to-end tests for the frontend application.

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- `npm`, `yarn`, or `pnpm`
- Turso account and database (for production/cloud database)

### Installation

1.  Clone the repository.
2.  Install the dependencies from the root of the monorepo:
    ```sh
    npm install
    ```
3.  Set up environment variables (create `.env` file in the root):
    ```env
    # Turso Database Configuration
    TURSO_DATABASE_URL=your_turso_database_url
    TURSO_AUTH_TOKEN=your_turso_auth_token
    
    # Optional: For local development without Turso
    # Leave TURSO_DATABASE_URL empty to use local SQLite
    ```

## 💻 Development

To run the applications in development mode, you can run the backend and frontend servers concurrently in separate terminals, or use Nx to run both at once:

### Run Backend and Frontend Together

```sh
nx run-many -t serve -p jlearning-api jlearning-front
```

Or, run each individually:

#### Running the Backend API

```sh
nx serve jlearning-api
```

The API will be available at `http://localhost:3000`.

#### Running the Frontend

```sh
nx serve jlearning-front
```

The frontend application will be available at `http://localhost:4200`.

## 🗄️ Database Configuration

This project uses **Drizzle ORM** with **Turso** (LibSQL) as the primary database solution:

### Turso Setup (Recommended)

1. **Create a Turso account** at [turso.tech](https://turso.tech)
2. **Create a new database** in the Turso dashboard
3. **Get your database URL and auth token** from the Turso dashboard
4. **Set environment variables** in your `.env` file:
   ```env
   TURSO_DATABASE_URL=libsql://your-database-name.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   ```

### Local Development (SQLite)

For local development without Turso, you can use a local SQLite database:

1. **Leave `TURSO_DATABASE_URL` empty** in your `.env` file
2. **The application will automatically use local SQLite** for development
3. **Database file** will be created at `jlearning.sqlite` in the project root

### Database Migrations

The project uses Drizzle Kit for database migrations:

```sh
# Generate migrations
nx run jlearning-api:drizzle-kit generate

# Apply migrations
nx run jlearning-api:drizzle-kit migrate
```

### Schema Management

- **Schema definitions** are located in `libs/api-common/src/lib/contexts/japanese-words/infrastructure/schema/`
- **Drizzle configuration** is in `apps/jlearning-api/drizzle.config.ts`
- **Migrations** are stored in `apps/jlearning-api/drizzle/`

## 🆕 New Features

- **AI-powered Vocabulary Extraction:** Paste or type Japanese text and let the app automatically extract and analyze vocabulary using Google Gemini (Gemini API key required for backend).
- **Batch Add Words:** Add multiple words at once, with duplicate handling and efficient bulk insert.
- **Editable Vocabulary Table:** Edit, filter, search, and sort your vocabulary. Supports inline editing, column visibility, and multi-column paste.
- **Stats Dashboard:** Visualize your progress with stats for total, mastered, learning, and reviewing words.
- **Modern UI:** Responsive, accessible, and themeable interface using Tailwind CSS and Radix UI components.
- **End-to-End Testing:** Playwright-based E2E tests for frontend reliability.
- **Modern Database Stack:** Migrated from TypeORM to Drizzle ORM with Turso (LibSQL) for better performance and type safety.

## 🛠️ Building for Production

To create production-ready bundles for the applications:

- **Backend:** `nx build jlearning-api`
- **Frontend:** `nx build jlearning-front`

The output will be placed in the `dist/` directory.

## ✅ Running Tests

To execute the unit tests for a specific project:

- **Backend:** `nx test jlearning-api`
- **Frontend:** `nx test jlearning-front`

## 💡 Useful Nx Commands

- **Visualize the Project Graph:**
  ```sh
  nx graph
  ```
- **See Project Capabilities:**
  ```sh
  nx show project <project-name>
  ```
