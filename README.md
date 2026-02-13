# LearningDashboard

A full-stack learning platform that turns expertise into structured learning paths with analytics, progress tracking, and rich content delivery.

## Why this project

LearningDashboard helps instructors design curriculum, publish resources, and track learner outcomes in one place. Learners get a clear path, rich materials, and a dashboard that makes progress visible.

## Highlights

- Role-based portals for admin, teacher, and learner flows.
- Learning path builder with modules, resources, and external links.
- File uploads for documents and media with metadata.
- Progress tracking and stats for learners and instructors.
- Authentication, subscriptions, and payments.

## Tech stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- Radix UI
- Framer Motion

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- Passport (OAuth)
- Stripe (subscriptions)
- Cloudinary (media)

## Project structure

```
LearningDashboard/
  client/   # React app
  server/   # Express API
```

## Getting started

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- MongoDB connection string

### Install

```bash
cd client
npm install

cd ../server
npm install
```

### Configure environment

Create a `.env` file in `server/` with your own keys. Common entries include:

```
PORT=5000
MONGODB_URI=your-mongodb-connection
JWT_SECRET=your-secret

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Stripe
STRIPE_SECRET_KEY=

# AI providers (optional)
OPENAI_API_KEY=
GOOGLE_API_KEY=
```

Adjust to match your local setup and any keys used in your deployment.

### Run the apps

```bash
# terminal 1
cd server
npm run server

# terminal 2
cd client
npm run dev
```

The client runs on the Vite dev server and talks to the Express API.

## Scripts

**Client**
- `npm run dev`
- `npm run build`
- `npm run preview`

**Server**
- `npm run server`
- `npm start`

## Roadmap ideas

- Team analytics and cohort comparisons
- Course templates and reusable module libraries
- Better media processing and previews

## License

MIT (add or update as needed)

