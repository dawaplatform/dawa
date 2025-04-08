# Dawa website - Next.js Application

[![Visit Dawa](https://img.shields.io/badge/Visit-Dawa-blue)](https://dawa-project.vercel.app/)

Dawa is a modern web application built with [Next.js](https://nextjs.org), bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and developed with **TypeScript**. The project incorporates **Tailwind CSS** for styling, utilizes **Shadcn UI components** for a consistent design system, and leverages the **Next.js App Router** for simplified page routing. Additionally, **NextAuth** is configured for authentication.

> **Note:** Dawa requires **Node.js v18 or above**.

---

## Table of Contents

- [Dawa website - Next.js Application](#dawa-website---nextjs-application)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
  - [On macOS and Linux](#on-macos-and-linux)
  - [Development Workflow](#development-workflow)
    - [Start the Development Server](#start-the-development-server)
    - [Linting and Formatting](#linting-and-formatting)
  - [Project Structure](#project-structure)
    - [Notable Directories](#notable-directories)
  - [Styling \& UI](#styling--ui)
  - [Authentication](#authentication)
  - [Testing](#testing)
  - [Available Scripts](#available-scripts)
  - [Deployment](#deployment)
  - [Additional Resources](#additional-resources)

---

## Features

- **Next.js 15 App Router** for streamlined page routing
- **TypeScript** for enhanced type safety and developer experience
- **Tailwind CSS** integrated for rapid and responsive styling
- **Shadcn UI** components for consistent, modern UI elements
- **NextAuth** integration for secure authentication
- **Jest** for unit and integration testing

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (or your preferred package manager such as Yarn or pnpm)
- A modern browser to view the application

---

## Installation

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/kolaborateplatform/dawa.git
cd dawa
```

### Install Dependencies

Install all required packages:

```bash
npm install
```

---

## On macOS and Linux

For macOS and Linux users, follow these additional tips:

1. **Verify Node.js Installation:**  
   Ensure you have Node.js version 18 or above installed. You can check your Node version with:

   ```bash
   node -v
   ```

   If you need to install or update Node.js, visit [nodejs.org](https://nodejs.org/) or use a version manager like [nvm](https://github.com/nvm-sh/nvm).

2. **Environment Variables:**  
   Create a `.env.local` file in the project root with the following variables (replace the placeholder values with your credentials):

   ```env
   NEXT_PUBLIC_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_APP_URL=https://your-api-url.com
   NEXT_PUBLIC_API_URL=https://your-api-url.com
   NEXTAUTH_SECRET=your_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

   This file is ignored by Git and is only for local development.  
   If you have a production environment, set these variables in your hosting platform (e.g., Vercel).

3. **Permissions:**  
   On some Linux systems, you might need to ensure that file permissions are set correctly. If you encounter permission issues, check your user privileges and adjust using `chmod` or run commands with `sudo` where appropriate.

---

## Development Workflow

### Start the Development Server

Start your local development server with the following command:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000). Changes to files will automatically trigger a refresh.

### Linting and Formatting

Maintain code quality and consistency using:

- **Lint the code:**
  ```bash
  npm run lint
  ```
- **Automatically fix lint issues:**
  ```bash
  npm run lint:fix
  ```
- **Format the code with Prettier:**
  ```bash
  npm run format
  ```

---

## Project Structure

Dawa leverages the Next.js **App Router**, primarily located in `src/app`. Below is an overview of the folder structure (as seen in your screenshot) and each folder’s purpose:

```
dawa-website/
├─ .next/               # Auto-generated Next.js build output
├─ .vscode/             # Visual Studio Code workspace settings (optional)
├─ node_modules/        # Auto-generated dependencies folder
├─ public/              # Public assets (images, icons, etc.)
├─ scripts/             # Custom scripts for build, deployment, or maintenance
├─ src/
│  ├─ _tests_/          # Jest test suites (unit and integration tests)
│  ├─ @core/            # Core utilities, foundational modules, or services
│  ├─ app/              # Main Next.js App Router entry point (pages, layouts)
│  ├─ components/       # Reusable UI components built with Shadcn UI
│  ├─ contexts/         # React context providers for global state
│  ├─ data/             # Local data, fixtures, or data-fetching logic
│  ├─ lib/              # Additional libraries or utility functions
│  └─ redux-store/      # Redux store configuration and slices (if using Redux)
├─ .env.local           # Local environment variables (ignored by Git)
├─ .prettierignore      # Files/paths ignored by Prettier
├─ .gitignore           # Files/paths ignored by Git
├─ components.json      # Shadcn UI configuration (if applicable)
├─ env.sample.txt       # Example environment variables file
├─ jest.setup.ts        # Jest setup/teardown configuration
├─ next-env.d.ts        # TypeScript definitions for Next.js
├─ next.config.js       # Next.js configuration
├─ package.json         # Project scripts and dependencies
├─ postcss.config.js    # PostCSS configuration (Tailwind, Autoprefixer, etc.)
├─ tailwind.config.ts   # Tailwind CSS configuration
├─ tsconfig.json        # TypeScript configuration
├─ LICENSE              # License information
└─ README.md            # This README file
```

### Notable Directories

- **`src/app`**  
  This is where the Next.js **App Router** is set up. Each subdirectory in `app` can contain `page.tsx` (or `layout.tsx`) to define pages and layouts.

- **`src/components`**  
  Houses UI components using Shadcn UI for consistent design patterns.

- **`src/_tests_`**  
  Contains test files for Jest. Tests can be co-located with components or placed here based on your preference.

- **`scripts`**  
  Any custom scripts for development, deployment, or other utilities that are not part of the default Next.js workflow.

- **`.env.local`**  
  Stores local environment variables needed for development (ignored by Git). Copy `env.sample.txt` to `.env.local` as a starting point.

Feel free to reorganize or rename folders to suit your project’s needs. The current structure is designed for clarity and scalability.

---

## Styling & UI

- **Tailwind CSS:**  
  Dawa uses Tailwind CSS for efficient and responsive styling. Tailwind’s utility-first approach makes it easy to build complex UIs quickly.
- **Shadcn UI:**  
  The project integrates Shadcn UI components for a consistent and modern design system. These components help maintain design consistency throughout the application.

---

## Authentication

NextAuth is set up for authentication with both Google and custom credentials providers. The authentication flow includes:

- **Google Sign-In:**  
  Utilizes Google OAuth for seamless third-party authentication.
- **Credentials Sign-In:**  
  Supports custom username/password login through an API endpoint.

Make sure to configure your environment variables with the appropriate Google API credentials and a secret for NextAuth.

---

## Testing

Dawa uses [Jest](https://jestjs.io/) for testing. To run tests, execute:

```bash
npm test
```

This command runs unit and integration tests to ensure application stability. You can also place test files within the `src/_tests_` directory or co-locate them with the corresponding components.

---

## Available Scripts

Below is a list of useful npm scripts:

- **Development:**  
  `npm run dev` – Start the Next.js development server.

- **Build:**  
  `npm run build` – Build the application for production.

- **Start:**  
  `npm run start` – Start the production server.

- **Testing:**  
  `npm run test` – Run Jest tests.

- **Linting:**  
  `npm run lint` – Check for code issues using ESLint.

- **Lint Fix:**  
  `npm run lint:fix` – Automatically fix lint issues.

- **Formatting:**  
  `npm run format` – Format code using Prettier.

---

## Deployment

The recommended deployment platform for Dawa is [Vercel](https://vercel.com), the company behind Next.js. To deploy:

1. Push your repository to GitHub.
2. Import your repository into Vercel.
3. Configure the required environment variables in the Vercel dashboard.
4. Deploy your project.

For detailed deployment instructions, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Additional Resources

- **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS:** [https://tailwindcss.com](https://tailwindcss.com)
- **Shadcn UI:** [https://ui.shadcn.com](https://ui.shadcn.com)
- **NextAuth:** [https://next-auth.js.org](https://next-auth.js.org)
- **Jest Testing:** [https://jestjs.io](https://jestjs.io)

---

By following this guide, you will be able to set up, develop, and deploy the Dawa application efficiently on macOS, Linux, or any other supported platform. Enjoy building with Dawa!
