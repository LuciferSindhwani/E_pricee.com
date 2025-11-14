# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ed450a15-78cc-4540-b3ea-17d2495ae3e9

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ed450a15-78cc-4540-b3ea-17d2495ae3e9) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Local dev:

```bash
# Frontend (Vite + React)
npm install
npm run dev

# Backend (Django + DRF)
cd server
python -m venv .venv
.venv\Scripts\activate # PowerShell
pip install -r requirements.txt
python manage.py makemigrations users trips
python manage.py migrate
python manage.py runserver
```

Backend env vars (set in `server/.env`):

- `DJANGO_SECRET_KEY` – optional, defaults to a dev-safe key
- `DATABASE_URL` – e.g. `mysql://user:password@localhost:3306/voyageai`
- `GEMINI_API_KEY` – Google Gemini key for AI itineraries
- Optional: `OPENWEATHER_API_KEY` for live weather data

Frontend proxies `/api` to `http://localhost:8000` during local dev.

Monitoring & CI: add GitHub Actions to lint/build/test and build Docker image; add Sentry/Logtail for FE/BE error logging; expose health at `/health`.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
