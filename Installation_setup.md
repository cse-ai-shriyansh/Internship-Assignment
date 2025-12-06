# Installation Guide

## Prerequisites

Before running this project, ensure you have the following installed on your system:

- Node.js (version 20.x or higher)
- npm (Node Package Manager)
- A Supabase account

## Required Dependencies

### Core Dependencies

- **next** (^15.0.0) - React framework for production
- **react** (^18.3.1) - JavaScript library for building user interfaces
- **react-dom** (^18.3.1) - React package for DOM rendering
- **@supabase/supabase-js** (^2.39.0) - Supabase client library for JavaScript
- **@tanstack/react-query** (^5.17.0) - Data fetching and state management library

### Development Dependencies

- **typescript** (^5.3.0) - TypeScript language compiler
- **@types/node** (^20.10.0) - Type definitions for Node.js
- **@types/react** (^18.3.0) - Type definitions for React
- **@types/react-dom** (^18.3.0) - Type definitions for React DOM
- **tailwindcss** (^3.4.0) - Utility-first CSS framework
- **postcss** (^8.4.0) - CSS transformation tool
- **autoprefixer** (^10.4.0) - PostCSS plugin to parse CSS and add vendor prefixes

## Installation Steps

### 1. Install Node.js and npm

Download and install Node.js from the official website: https://nodejs.org/

Verify installation by running:

```bash
node --version
npm --version
```

### 2. Install Project Dependencies

Navigate to the `section4` directory and run:

```bash
cd section4
npm install
```

This command will install all dependencies listed in the `package.json` file.

### 3. Environment Configuration

Create a `.env.local` file in the `section4` directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholder values with your actual Supabase credentials.

## Running the Application

After installation, you can run the application using:

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Additional Commands

- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Run linter**: `npm run lint`
