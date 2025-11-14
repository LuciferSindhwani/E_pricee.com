# VoyageAI - Setup & Running Guide

## Project Overview
This is a full-stack travel planning application:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Django REST Framework with Gemini AI integration
- **Database**: SQLite (local) or MySQL (production)
- **AI**: Google Gemini API for itinerary generation

## Prerequisites
- **Node.js** (v16+) and npm/bun
- **Python** (v3.9+) 
- **MySQL** (optional, SQLite is default)
- **Gemini API Key** (already configured in `.env`)

## Backend Setup

### 1. Create & Activate Virtual Environment

**Windows (PowerShell):**
```powershell
cd server
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
cd server
python -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Database Migrations
```bash
python manage.py migrate
```

### 4. Start Backend Server
```bash
python manage.py runserver
```
Backend will run on: **http://localhost:8000**

---

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
# or
bun install
```

### 2. Start Development Server
```bash
npm run dev
# or
bun run dev
```
Frontend will run on: **http://localhost:5173**

---

## Running Both Servers (Recommended)

### Option 1: Two Terminal Windows

**Terminal 1 (Backend):**
```powershell
cd server
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

**Terminal 2 (Frontend):**
```powershell
npm run dev
```

### Option 2: Using VS Code Tasks
1. Open Command Palette: `Ctrl+Shift+P`
2. Search for "Run Task"
3. Select tasks to run both servers

---

## Environment Configuration

### Backend `.env` (server/.env)
```
DATABASE_URL=mysql://root:1234@localhost:3306/voyageai
GEMINI_API_KEY=AIzaSyBikAlwSqWO6p-S3KWAQc1N-ybPPRQWdak
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=true
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:5173
```

---

## Available API Endpoints

### Trips
- `POST /api/trips/` - Create a trip
- `GET /api/trips/{trip_id}/` - Get trip details
- `POST /api/trips/{trip_id}/generate/` - Generate AI itinerary
- `GET /api/trips/discover/` - Discover public trips

### Carpools
- `GET /api/trips/{trip_id}/carpools/` - List carpools
- `POST /api/trips/{trip_id}/carpools/` - Create carpool

### Users
- `POST /api/users/register/` - Register
- `POST /api/users/login/` - Login

---

## Gemini AI Integration

The Gemini API is configured to generate travel itineraries. When you create a trip and call the generate endpoint:

1. Trip details are sent to Gemini 1.5 Flash model
2. Model generates JSON with:
   - Daily activities
   - Budget tips
   - Alternative plans
   - Weather considerations

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/trips/{trip_id}/generate/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"group_size": 4}'
```

---

## Troubleshooting

### Virtual Environment Not Activating
**Windows:** Use `.\venv\Scripts\Activate.ps1` (not `activate.bat`)

### Port 8000 Already in Use
```bash
python manage.py runserver 8001
```

### Module Not Found Errors
- Ensure venv is activated
- Run: `pip install -r requirements.txt`

### CORS Issues
- Check `FRONTEND_URL` in `.env` matches your frontend URL
- Verify `CORS_ALLOWED_ORIGINS` in `settings.py`

### Database Errors
- Run: `python manage.py migrate`
- Check MySQL connection if using `DATABASE_URL`

---

## API Testing

### Using Thunder Client or Postman
1. Import the endpoints above
2. Add `Authorization: Bearer {token}` header
3. Set `Content-Type: application/json`

### Quick Test
```bash
# Get token
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Create trip
curl -X POST http://localhost:8000/api/trips/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Paris Trip",
    "location": "Paris, France",
    "start_date": "2025-06-01",
    "end_date": "2025-06-07",
    "budget_cents": 500000
  }'
```

