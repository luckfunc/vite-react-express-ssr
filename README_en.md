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

The workflow for adding a new page is highly engineered, with paths being automatically derived from directory names to prevent manual errors.

Let's say you want to add a `contact` page, which will correspond to the `/contact` path:

**Step 1: Create Page Files**

1.  **Create the Backend Route File**: `server/routes/contact/index.tsx`
    -   This file now **only needs to export a `router` function**.

2.  **Create the Frontend Entry File**: `src/pages/contact/client.tsx`
    -   The content is the same as before, used for client-side hydration.

**Step 2: Register the New Page in the Route Hub**

-   Open the `server/routes/index.ts` file.
-   Import your newly created route module and add it as a **property** to the `routes` object. The `key` of the object will be used as the page's path name.

    ```typescript
    import * as home from './home/index.tsx';
    import * as about from './about/index.tsx';
    import * as contact from './contact/index.tsx'; // 1. Import the new route

    export const routes = {
      home,      // -> path will be '/'
      about,     // -> path will be '/about'
      contact,   // 2. Add to the object, the key is the path name
    };
    ```

That's it! Restart the development server (`pnpm dev`), and the new route will be active. This is the most robust and clear workflow.

## Passing Props from Server to Client

In a real-world app, you'll need to fetch data on the server and use it to render your page. This template uses a type-safe process called "state hydration" to make this seamless. To ensure type safety across the server and client, we use the `src/types/index.ts` file for all shared type definitions.

**Here's the workflow:**

1.  **Define a Shared Type**: Define the Props interface for your page component in `src/types/index.ts`.
    ```typescript
    export interface HomePageProps {
      userName: string;
    }
    ```
2.  **Provide Data on the Server**: In your route file (e.g., `server/routes/home/index.tsx`), import the type, create your data object, and pass it to both your component and the `renderPage` function.
    ```typescript
    import type { HomePageProps } from '../../../src/types';
    // ...
    const initialData: HomePageProps = { userName: 'Gemini' };
    const pageComponent = <HomePage {...initialData} />;
    const html = renderPage(pageComponent, 'home', initialData);
    // ...
    ```
3.  **Receive Data on the Client**: The client entry file (e.g., `src/pages/home/client.tsx`) automatically receives the data. To let TypeScript know its shape, import the shared type and use a type assertion.
    ```typescript
    import type { HomePageProps } from '../../types';
    // ...
    const initialData = JSON.parse(...) as HomePageProps;
    hydrateRoot(document.getElementById('root')!, <HomePage {...initialData} />);
    ```

Following this pattern gives you full, end-to-end type safety for your data. Any mismatch between what the server sends and what the client expects will be caught by TypeScript at compile time.
