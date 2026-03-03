# AI Movie Insight Builder

## Overview

AI Movie Insight Builder is a full-stack web application that allows users to enter an IMDb movie ID (e.g., tt0133093, ) and retrieve detailed movie information along with AI-generated audience sentiment insights.

The application fetches structured movie metadata from the OMDb API and uses Google Gemini AI to generate a structured audience-style summary and sentiment classification (Positive / Mixed / Negative).

This project was built as part of the Brew Full-Stack Developer Internship Hiring Assignment.

---

## Live Deployment

Deployed on Vercel:

👉 https://ai-movie-insight-builder-opal.vercel.app/

---

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React
- Tailwind CSS
- Framer Motion

### Backend
- Next.js API Routes
- Node.js runtime

### External APIs
- OMDb API (movie metadata)
- Google Gemini API (AI-based sentiment analysis)

---

## Core Features

- Search by IMDb ID
- Display movie title, poster, cast, release year, IMDb rating, and plot
- AI-generated audience-style summary
- Overall sentiment classification (Positive / Mixed / Negative)
- Sentiment confidence score
- Responsive UI (mobile + desktop)
- Loading state management
- Graceful error handling
- Rate-limit protection for AI API
- In-memory caching to reduce redundant AI calls

---

## Architecture & Design Approach

The application follows a simple and maintainable full-stack architecture:

User Input  
→ Frontend (Next.js Page)  
→ API Route (`/api/movie`)  
→ Fetch OMDb metadata  
→ Generate AI insight via Gemini  
→ Normalize sentiment classification  
→ Cache response in memory  
→ Return structured JSON to frontend  
→ Render UI

### Why This Approach?

- Clear separation of frontend and backend logic
- No over-engineering (no unnecessary database or services)
- Designed for readability and maintainability
- Optimized to handle AI rate limits safely

---

## AI Integration

Google Gemini API is used to:

1. Generate a structured 4-line audience-style summary
2. Highlight one appreciated aspect
3. Mention one possible criticism
4. Output a final sentiment classification

The backend extracts and normalizes the sentiment into:
- Positive
- Mixed
- Negative

### Why Gemini Flash?

Gemini Flash was selected because:
- Lightweight and efficient
- Suitable for structured text generation
- Works well within free-tier constraints

---

## Caching Strategy

An in-memory `Map` is used to cache movie responses by IMDb ID.

### Why In-Memory Cache?

- Prevents duplicate AI API calls
- Reduces rate-limit issues
- Keeps architecture simple
- Avoids unnecessary database complexity

For production-scale systems, this could be replaced with Redis or a distributed caching layer.

---

## Rate Limit Protection

If Gemini returns a 429 (quota exceeded):

- The backend temporarily blocks further AI calls
- A graceful error response is returned
- The system remains stable

This ensures the application does not repeatedly trigger quota violations.

---

## Security & Environment Configuration

Sensitive keys are stored in environment variables:

- `OMDB_API_KEY`
- `GEMINI_API_KEY`

`.env.local` is ignored via `.gitignore`, and a `.env.example` file is provided for setup reference.

No API keys are exposed in the frontend.

---

## API Usage Note (Free-Tier Constraint)

This application uses the free-tier version of the Google Gemini API.

Due to strict request-per-minute limits imposed by the free plan, excessive or rapid repeated searches may temporarily trigger rate limiting (HTTP 429).

To ensure stability:

- In-memory caching is implemented to prevent duplicate AI calls.
- Graceful error handling informs users if the limit is reached.

For evaluation purposes, normal usage (occasional searches) works reliably.  
In a production environment, this would be resolved using a paid tier or distributed caching.
