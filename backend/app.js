import express from "express";
import bodyParser from "body-parser";
import env from 'dotenv';

const app = express();
const port = 8080;
const saltRounds = 10
env.config();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUnitialized: true,
    })
);

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong.';
    res.status(status).json({ message: message })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});