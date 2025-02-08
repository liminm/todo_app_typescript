import express, {Application, Request, Response} from 'express';
import todosRouter from './routes/todos';
import cors from 'cors'; // Import the cors package

const app: Application = express();
app.use(cors());

app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
    res.send(200).json({status: 'OK'})
})

app.use('/api/todos', todosRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

