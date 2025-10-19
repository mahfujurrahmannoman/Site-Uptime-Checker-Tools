# Site Status Checker

An elegant web application that uses the Google Gemini API to check if a website is up or down, providing real-time status updates and a history of your checks.

![Site Status Checker Screenshot](https://i.imgur.com/8QzXy2K.png)

## ✨ Features

- **Instant Status Checks**: Enter any URL to check its current status.
- **AI-Powered Analysis**: Leverages the Gemini API to determine if a site is genuinely up or down, interpreting various HTTP status codes and connection issues.
- **Detailed Results**: Provides the final status (Up/Down), the HTTP status code, and a human-readable reason.
- **Check History**: Keeps a running list of your recent checks for easy reference.
- **Sleek & Responsive UI**: A modern, dark-themed interface built with Tailwind CSS that works great on all devices.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS (via CDN)
- **AI**: Google Gemini API (`@google/genai`)

## 🚀 Deployment Guide

This is a client-side application that requires a secure way to handle your Google Gemini API key. The recommended way to deploy it is through a modern hosting provider like **Vercel** or **Netlify**, which can manage environment variables securely.

### Prerequisites

1.  **A Google Gemini API Key**: You'll need an API key to use the Gemini service.
    -   You can get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).

2.  **A GitHub/GitLab/Bitbucket Account**: To host your code and connect it to a deployment service.

### Deployment Steps (Example with Vercel)

#### Step 1: Set Up Your Code Repository

1.  Download or clone all the project files (`index.html`, `App.tsx`, `services/geminiService.ts`, etc.).
2.  Create a new repository on your preferred Git provider (e.g., GitHub).
3.  Push the project files to your new repository.

#### Step 2: Deploy to Vercel

1.  **Sign up or log in** to [Vercel](https://vercel.com/) using your Git provider account.
2.  From your Vercel dashboard, click **"Add New... > Project"**.
3.  **Import the Git repository** you just created.
4.  Vercel will analyze the project. Since this is a simple static project without a traditional build step, you can keep the default settings.
    -   **Framework Preset**: Other
    -   **Build Command**: Leave empty.
    -   **Output Directory**: Leave as default.
5.  Before deploying, expand the **"Environment Variables"** section.

#### Step 3: Configure the API Key

1.  In the "Environment Variables" section, add a new variable:
    -   **Name**: `API_KEY`
    -   **Value**: Paste your Google Gemini API Key here.

2.  Click **"Add"** to save the variable.



#### Step 4: Deploy

1.  Click the **"Deploy"** button.
2.  Vercel will deploy your application. Once finished, it will provide you with a public URL.

Your Site Status Checker is now live and ready to use!

---

## 💻 Local Development

Running this application locally is more complex because the code expects `process.env.API_KEY`, which is not available in a browser by default when serving static files.

For development and testing, you would typically use a development server (like Vite or Create React App) that can inject environment variables. However, for this specific file structure, the simplest (but **not recommended for production**) method is to temporarily replace the key in the code.

**Disclaimer**: Never commit your API key directly into your Git repository.

1.  Open `services/geminiService.ts`.
2.  Find this line:
    ```typescript
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    ```
3.  Temporarily change it to:
    ```typescript
    const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY_HERE" });
    ```
4.  Run a simple local server. If you have Node.js installed, you can use the `serve` package:
    ```bash
    # Install serve globally
    npm install -g serve

    # Run the server from your project's root directory
    serve .
    ```
5.  Open the provided URL (e.g., `http://localhost:3000`) in your browser.
6.  **Important**: Remember to revert the change before committing your code!
