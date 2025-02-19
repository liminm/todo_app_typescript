// Import the Router type and Request, Response types from Express
import {Router, Request, Response} from 'express'
import {ITodo} from '../models/TodoModel'
// Import the Todo interface from the models folder
import Todo from '../models/TodoModel'
import user from "../models/User";

// Create a new router instance to define our endpoints
const router: Router = Router()


// Define a GET endpoint to return all todo items
router.get('/', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId
        const todos = await Todo.find({user: userId})
        // Return the array of todos with a 200 OK status
        res.status(200).json(todos)
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch todos'})
    }

})

// Define a POST endpoint to add a new todo item
router.post('/', async (req: Request, res: Response) => {
    // Extract the title from the request body
    const {title} = req.body
    const userId = (req as any).user.userId

    const newTodo = new Todo({
        title: title,
        completed: false,
        user: userId
    })

    try {
        const savedTodo = await newTodo.save()
        res.status(201).json(savedTodo)
    } catch (err) {
        res.status(500).json({error: 'Failed to add todo'})
    }
})


// Define a PUT endpoint to update an existing todo item by id
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    // Convert the id parameter from the URL to a number
    const todoId: string = req.params.id
    // Extract the updated title and completed status from the request body
    const {title, completed} = req.body
    const userId = (req as any).user.userId


    try {
        const todo = await Todo.findOne({_id: todoId, user: userId})
        if (!todo) {
            res.status(404).json({error: 'Todo not found'})
            return
        }

        todo.title = title
        todo.completed = completed
        const updatedTodo = await todo.save()
        res.status(200).json(updatedTodo)
    } catch (err) {
        res.status(500).json({error: 'Failed to update todo'})
    }
})

// Define a DELETE endpoint to remove a todo item by id
router.delete(`/:id`, async (req: Request, res: Response): Promise<void> => {
    // Convert the id parameter from the URL to a number
    const todoId = req.params.id
    const userId = (req as any).user.userId

    try {

        const deletedTodo = await Todo.findOneAndDelete({_id: todoId, user: userId})
        if (!deletedTodo) {
            res.status(404).json({error: 'Todo not found'})
            return
        }
        res.status(200).json(deletedTodo)
    } catch (err) {
        res.status(500).json({error: 'Failed to delete todo'})
    }
})

// Export the router so it can be integrated with the main server
export default router
