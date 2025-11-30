import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import passport from 'passport';
import {connectCloudinary} from './config/cloudinary.js';
import 'dotenv/config'; // Import environment variables
import teacherRouter from './routes/teacherRoute.js';
import learnerRouter from './routes/learnerRoute.js';
import learningPathRouter from './routes/learningPathRoute.js';
import adminRouter from './routes/adminRoute.js'; // Import admin 
import authRoute from './routes/authRoute.js'; // Import auth routes for password reset
import aiRoute from './routes/aiRoute.js'
import dotenv from 'dotenv';
dotenv.config();

import './config/passport.js'; // Ensure passport configuration is loaded
import session from 'express-session';

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
await connectDB(); // Ensure the database connection is established before starting the server
await connectCloudinary(); // Connect to Cloudinary for image uploads

const allowedOrigins = ['http://localhost:5173' , 'https://learning-dashboard-two.vercel.app/']

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({
  origin: [
    "http://localhost:5173",                          // Local React
    "https://learning-dashboard-two.vercel.app",      // <--- YOUR NEW FRONTEND URL
    "https://learning-dashboard-iyjo.vercel.app"      // Your Backend URL (good to have)
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true // <--- IMPORTANT: This allows cookies/sessions to be sent
}));
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use the teacher routes
app.use('/api/teacher', teacherRouter); // Use the teacher routes for all requests to /api/teacher
// Use the learner routes
app.use('/api/learner', learnerRouter); // Use the learner routes for all requests
// Use the admin routes
app.use('/api/admin', adminRouter); // Use the admin routes for all requests to /

app.use("/uploads", express.static("uploads"));

app.use('/api/learningpaths', learningPathRouter);

app.use('/api/auth/forgot-password', authRoute); // Use the auth routes for password reset

app.use("/api/ai", aiRoute);



app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: true,
    }),
    (req, res) => {
        // Success, redirect to dashboard or issue JWT
        res.redirect('/teacher'); 
    }
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});