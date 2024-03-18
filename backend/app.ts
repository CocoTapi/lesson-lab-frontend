import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import session from "express-session";

import authRoutes from './auth/authRoutes'

const app = express();
const port = 8080;

// app.use(
//     session({
//         secret: process.env.SESSION_SECRET as string,
//         resave: false,
//         saveUninitialized: true,
//     })
// );

app.use(bodyParser.json());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//     next();
// });

app.use(authRoutes);
// Custom error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong.';
    res.status(status).json({ error: message })
})

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});