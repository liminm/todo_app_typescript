// Import the Router type and Request, Response types from Express
import {Router, Request, Response} from 'express'
import {ITodo} from '../models/TodoModel'
// Import the Todo interface from the models folder
import Todo from '../models/TodoModel'

// Create a new router instance to define our endpoints
const router: Router = Router()


// Define a GET endpoint to return all todo items
router.get('/', async (req: Request, res: Response) => {
    try {
        const todos = await Todo.find()
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

    const newTodo = new Todo({
        title: title,
        completed: false
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

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            {title, completed},
            {new: true}
        )

        if (!updatedTodo) {
            res.status(404).json({error: 'Todo not found'})
            return
        }
        res.status(200).json(updatedTodo)
    } catch (err) {
        res.status(500).json({error: 'Failed to update todo'})
    }
})

// Define a DELETE endpoint to remove a todo item by id
router.delete(`/:id`, async (req: Request, res: Response):Promise<void> => {
    // Convert the id parameter from the URL to a number
    const todoId = req.params.id

    try {
        const deletedTodo = await Todo.findByIdAndDelete(todoId)
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
