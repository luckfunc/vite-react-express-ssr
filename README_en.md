English · [中文](./README.md)

# vite-react-express-ssr

This is a template for building a Server-Side Rendered (SSR) application using React, Vite, and Express.

It's configured for a great developer experience with hot-reloading for both server and client code, and it's optimized for production builds.

## Features

-   **React 19**: Leveraging the latest React features.
-   **Vite**: For fast client-side bundling and a great development experience.
-   **Express**: A robust Node.js server for handling SSR.
-   **TypeScript**: For type safety across the entire stack.
-   **Hot-Reloading**: `nodemon` for the server and Vite's HMR for the client.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or newer)
-   [pnpm](https://pnpm.io/) (or you can adapt the commands for npm/yarn)

## Installation

1.  Clone the repository.
2.  Install the dependencies using pnpm:

    ```bash
    pnpm install
    ```

## Available Scripts

### `pnpm dev`

Starts the development server.

-   The client-side assets are handled by the Vite dev server.
-   The Express server is watched by `nodemon` and will restart on any changes in the `server/` directory.
-   The application will be available at `http://localhost:3000`.

### `pnpm build`

Builds the application for production.

-   Compiles the client-side code with Vite into the `dist/client` directory.
-   Compiles the server-side TypeScript into the `dist/server` directory.

### `pnpm start`

Starts the application in production mode.

-   Serves the pre-built assets from the `dist/` directory.
-   **Note**: You must run `pnpm build` before you can run this command.

### `pnpm type-check`

Runs the TypeScript compiler to check for any type errors in the project.

## Project Structure

```
.
├── dist/         # Compiled output for production
├── server/       # Express server source code
│   ├── routes/   # Page-specific routes and components
│   └── index.ts  # Server entry point
├── src/          # Client-side source code
│   └── pages/    # Page-specific client entry points (for hydration)
├── public/       # Static assets
├── package.json
└── vite.config.ts
```

## How to Add a New Page

Thanks to the "Convention over Configuration" principle, adding a new page is now very simple, with **no configuration files to modify**.

Let's say you want to add a `contact` page at the `/contact` path:

1.  **Create the Backend Route File**:
    -   Create a new folder inside `server/routes/`, for example, `contact`.
    -   Create an `index.tsx` file inside `server/routes/contact/`.
    -   This file must export two things:
        -   `path` (string): The URL path for the page (e.g., `export const path = '/contact';`)
        -   `router` (function): The Express router handler (e.g., `export function router() { ... }`)

2.  **Create the Frontend Entry File**:
    -   Create a corresponding folder inside `src/pages/`, for example, `contact`.
    -   Create a `client.tsx` file inside `src/pages/contact/` for client-side hydration.

That's it! Restart the development server (`pnpm dev`), and the new `/contact` route will be automatically discovered and available.
