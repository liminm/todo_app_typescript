// Import React and necessary types
import React from 'react'

// Define the type for the component props using an interface
interface TodoItemProps {
    // Unique id for the todo item
    _id: string
    // Title of the todo
    title: string
    // Indicates whether the todo is completed
    completed: boolean
    // Callback function when the todo is toggled
    onToggle: (_id: string) => void
    onDelete: (_id: string) => void
}

// Define the TodoItem component as a functional component
const TodoItem: React.FC<TodoItemProps> = ({ _id, title, completed, onToggle, onDelete }) => {
    return (
        <div>
            <input
                type="checkbox"
                checked={completed}
                onChange={() => onToggle(_id)}
            />
            <span>{title}</span>
            <button onClick={() => onDelete(_id)}>Delete</button>
        </div>
    )
}

// Export the component for use in other parts of the application
export default TodoItem
