# Kaste Brands & Designs - Modern Portfolio (Vite Version)

This is a modern, dynamic portfolio website for brand and AI solution design, built with React and Vite. It features a hidden admin panel for real-time customization of content and themes, with all changes saved to `localStorage`.

This version is properly configured with a build step to ensure compatibility and performance for production deployment.

## Features

-   **Vite Build System:** Fast, modern, and reliable build process for development and production.
-   **Fully Responsive Design:** With Tailwind CSS for a utility-first approach.
-   **Light/Dark Mode:** User-selectable theme preference.
-   **Real-time Customization:** A hidden admin panel allows real-time updates to content and theme settings.
-   **AI-Powered Assistant:** Integrated with Google Gemini for an interactive chat experience.
-   **Contact Form:** Functional contact form using EmailJS.
-   **Secure Credential Management:** Uses environment variables for all API keys, ensuring no secrets are exposed in the code.

## Local Development Setup

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (version 18 or higher recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 2. Installation

1.  Clone the repository to your local machine.
2.  Navigate to the project directory in your terminal.
3.  Install the necessary dependencies:
    ```bash
    npm install
    ```

### 3. Configuration

This project uses environment variables to handle secret API keys.

1.  Create a new file in the root of the project named `.env.local`.
2.  Copy the contents of `.env.example` into your new `.env.local` file.
3.  Fill in the placeholder values for each variable with your actual keys from Firebase, Google Gemini, and EmailJS.

### 4. Running the Application

Once you've installed the dependencies and configured your `.env.local` file, you can start the local development server:

```bash
npm run dev
```

This will start the application on a local URL (usually `http://localhost:5173`). The server features Hot Module Replacement (HMR), so changes you make to the code will appear instantly in the browser.

## Deployment to Vercel

1.  **Push to Git:** Push your project to a GitHub, GitLab, or Bitbucket repository. Your `.gitignore` file will prevent `node_modules` and `.env.local` from being uploaded.

2.  **Import Project in Vercel:** In your Vercel dashboard, import your Git repository.

3.  **Configure Project:** Vercel will likely detect this as a Vite project. Ensure the settings are as follows:
    -   **Framework Preset:** `Vite`
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `dist`

4.  **Add Environment Variables:**
    -   In your Vercel project's settings, go to the "Environment Variables" section.
    -   For each variable listed in your `.env.example` file, add a corresponding entry in Vercel.
    -   **Important:** The names must match exactly (e.g., `VITE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`).

5.  **Deploy:** Click the "Deploy" button. Vercel will build your project and deploy it to a public URL.
