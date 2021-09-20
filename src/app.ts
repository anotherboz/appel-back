import express from 'express';
import cookieParser from 'cookie-parser';
import { router as userRouter } from './routers/user';
import { router as eleveRouter } from './routers/eleve';

require('dotenv').config({ path: __dirname+'/.env' });

const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Appel version 1.0');
});

app.use('/user', userRouter);
app.use('/eleve', eleveRouter);

const port = parseInt(process.env.PORT as string, 10) | 3000;
app.listen(port, () => {
    console.log(`Appel server is listening on ${port}`);
});