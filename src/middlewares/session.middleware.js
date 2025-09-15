import express from 'express';
import  session from 'express-session';
const app = express();

app.use(session({
    secret: 'Acbd@1998',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 *3}
}))