// Import the Router type and Request, Response types from Express
import { Router, Request, Response } from 'express'

// Import the Todo interface from the models folder
import { Todo } from '../models/Todo'

// Create a new router instance to define our endpoints
const router: Router = Router()

// Create an in-memory array to store todo items
let todos: Todo[] = [
    // Start with an example todo item
    { id: 1, title: 'Learn TypeScript', completed: false }
]

// Define a GET endpoint to return all todo items
router.get('/', (req: Request, res: Response) => {
    // Return the array of todos with a 200 OK status
    res.status(200).json(todos)
})

// Define a POST endpoint to add a new todo item
router.post('/', (req: Request, res: Response) => {
    // Extract the title from the request body
    const { title } = req.body

    // Create a new todo item with an auto-generated id and a default 'not completed' status
    const newTodo: Todo = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        title: title,
        completed: false
    }

    // Add the new todo item to the in-memory array
    todos.push(newTodo)

    // Respond with the new todo item and a 201 Created status
    res.status(201).json(newTodo)
})

// Define a PUT endpoint to update an existing todo item by id
router.put('/:id', (req: Request, res: Response) => {
    // Convert the id parameter from the URL to a number
    const todoId: number = parseInt(req.params.id, 10)

    // Extract the updated title and completed status from the request body
    const { title, completed } = req.body

    // Find the index of the todo item that matches the given id
    const index = todos.findIndex((todo) => todo.id === todoId)
    // If no todo item is found, respond with a 404 Not Found error
    if (index === -1) {
        res.status(404).json({ error: 'Todo not found' })
        return
    }

    // Update the found todo item with new values
    todos[index] = { ...todos[index], title, completed }
    // Respond with the updated todo item and a 200 OK status
    res.status(200).json(todos[index])
})

// Define a DELETE endpoint to remove a todo item by id
router.delete('/:id', (req: Request, res: Response) => {
    // Convert the id parameter from the URL to a number
    const todoId: number = parseInt(req.params.id, 10)

    // Find the index of the todo item with the given id
    const index = todos.findIndex((todo) => todo.id === todoId)
    // If no todo item is found, respond with a 404 Not Found error
    if (index === -1) {
        res.status(404).json({ error: 'Todo not found' })
        return
    }

    // Remove the todo item from the array using splice
    const removed = todos.splice(index, 1)
    // Respond with the removed todo item and a 200 OK status
    res.status(200).json(removed[0])
})

// Export the router so it can be integrated with the main server
export default router
