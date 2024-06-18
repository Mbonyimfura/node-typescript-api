import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import compression from "compression";
import dotenv from 'dotenv';
import router from './routes/index.js';
import connectDB from "./config/db.js";
dotenv.config();
const app = express();
const port = 3000;
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.get('/', (req, res) => {
    res.send('Express + TypeScript');
});
app.use('/', router);
app.listen(port, () => {
    console.log(`The server is running on ${port} port!`);
});
connectDB();
