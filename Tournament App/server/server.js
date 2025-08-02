import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from "./src/routes/userRoutes.js";
import { connectDB } from './src/config/db.js';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import "./src/config/passport.js";
import passport from 'passport';
import teamRoutes from './src/routes/teamRoutes.js';
import joinRequestRoutes from "./src/routes/joinRequestRoutes.js";
import invitationRoutes from './src/routes/invitationRoutes.js';
import tournamentRoutes from './src/routes/tournamentRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
// Load the environment variables
dotenv.config();
const app = express();

// session
app.use(session({
    secret: 'khoa1234',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/leaguex',
        collectionName: 'sessions',
    }),
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

app.use(passport.initialize());
app.use(passport.session());

// Iniatilize express
const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware
// This is used to access to the req.body (was used by body-parser)
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
connectDB();

app.listen(process.env.PORT, () => {
    console.log("Server is listening on port " + PORT);
})

app.get("/", (req, res) => {
    res.send("Leaguex server")
})

app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/requests", joinRequestRoutes);
app.use("/invitations", invitationRoutes);
app.use("/tournaments", tournamentRoutes);
app.use("/matches", matchRoutes);