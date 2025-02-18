import mongoose from 'mongoose'

import express, {Application, Request, Response} from 'express';
import authRouter from './routes/auth';
import todosRouter from './routes/todos';
import authMiddleware from './middleware/auth';
import cors from 'cors'; // Import the cors package
import errorHandler from "./middleware/errorHandler";

const app: Application = express();
app.use(cors());

app.use(express.json());

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set')
}

mongoose
    .connect(process.env.MONGODB_URI, {
    })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err)
    })



app.get('/api/v1/health', (req: Request, res: Response) => {
    res.send(200).json({status: 'OK'})
})

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/todos',authMiddleware,  todosRouter);
// app.use('/api/v1/todos', todosRouter);
app.use(errorHandler)


export default app;