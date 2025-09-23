# JLearning Monorepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

This workspace is a monorepo managed by [Nx](https://nx.dev) for the JLearning project, a Japanese language learning application.

## ✨ Tech Stack

-   **Monorepo:** Nx
-   **Backend:** NestJS, TypeORM, SQLite
-   **Frontend:** React, Vite, TypeScript, React Router

## 📦 Projects in this Workspace

This monorepo contains the following main applications:

-   `jlearning-api`: The backend REST API built with NestJS. It handles business logic and database interactions.
-   `jlearning-front`: The frontend application built with React and Vite.
-   `jlearning-front-e2e`: End-to-end tests for the frontend application.

## 🚀 Getting Started

### Prerequisites

-   Node.js (LTS version recommended)
-   `npm`, `yarn`, or `pnpm`

### Installation

1.  Clone the repository.
2.  Install the dependencies from the root of the monorepo:
    ```sh
    npm install
    ```

## 💻 Development

To run the applications in development mode, you can run the backend and frontend servers concurrently in separate terminals.

### Running the Backend API

```sh
nx serve jlearning-api
```

The API will be available at `http://localhost:3000`.

### Running the Frontend

```sh
nx serve jlearning-front
```

The frontend application will be available at `http://localhost:4200`.

## 🛠️ Building for Production

To create production-ready bundles for the applications:

-   **Backend:** `nx build jlearning-api`
-   **Frontend:** `nx build jlearning-front`

The output will be placed in the `dist/` directory.

## ✅ Running Tests

To execute the unit tests for a specific project:

-   **Backend:** `nx test jlearning-api`
-   **Frontend:** `nx test jlearning-front`

## 💡 Useful Nx Commands

-   **Visualize the Project Graph:**
    ```sh
    nx graph
    ```
-   **See Project Capabilities:**
    ```sh
    nx show project <project-name>
    ```


