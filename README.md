# 🧠 QuizMaster | Full-Stack Trivia & Quiz Platform

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black) ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

**QuizMaster** is a modern, full-stack web application built to challenge your knowledge, create custom quizzes, and compete with friends. It leverages the Next.js App Router for seamless performance, Drizzle ORM for type-safe database interactions, and dynamic SEO capabilities to make sharing quizzes and profiles a breeze.

🌐 **Live Demo:** [https://quiz-master-public.vercel.app](https://quiz-master-public.vercel.app)

## ✨ Features

- **Custom Quiz Creation:** An intuitive, protected interface to build, configure, and publish your own trivia challenges.
- **Play & Compete:** Take public quizzes dynamically routed and instantly see your score and results upon completion.
- **User Authentication & Profiles:** Secure sign-up/login flows, password reset functionality, and personalized dashboards to track past performance (`/my-results`).
- **Server Actions & API:** Utilizes modern Next.js Server Actions (`/actions`) for secure, server-side database mutations and form submissions.
- **SEO Optimized:** Dynamic `sitemap.xml` and `robots.txt` generation for public quizzes and user profiles to ensure maximum search engine visibility.
- **Progressive Web App (PWA):** Fully configured web app manifest for standalone display, complete with maskable icons for mobile devices.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn UI, Lucide React (Icons)

## 🚀 Getting Started

Follow these steps to get the full-stack environment running locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) installed globally

### Installation & Execution

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Krychq/quiz-master-public.git
    cd quiz-master-public
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Configure Environment Variables:**
    Rename the `.env.example` file to `.env.local` (or create a new one) and add your respective database connections and secret keys:

    ```env
    DATABASE_URL=
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    NEXT_PUBLIC_SITE_URL="http://localhost:3000"
    ```

4.  **Database Setup:**
    Run the Drizzle migrations to sync your local database schema:

    ```bash
    pnpm db:push
    ```

5.  **Start the Next.js development server:**

    ```bash
    pnpm dev
    ```

6.  **View the app:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure Snapshot

- **`app/`**: Next.js App Router root, containing all core application pages and logic.
  - **`actions/`**: Server Actions for data mutation without building separate API endpoints.
  - **`api/`**: RESTful endpoints for external or client-side fetching.
  - **`auth/` & `reset-password/`**: Authentication workflows.
  - **`create/`**: Protected route for quiz builders.
  - **`quiz/`**: Dynamic routing for the quiz playing interface.
  - **`my-results/` & `profile/`**: User-specific dashboards and public profile pages.
- **`components/`**: Reusable React UI components.
- **`db/`**: Drizzle ORM configuration and database schema definition.
- **`lib/`**: Shared utility functions, type definitions, and configurations.
- **`public/`**: Static assets, including PWA icons.

## 📝 License

This project is licensed under the MIT License. Feel free to use it for your own educational purposes!
