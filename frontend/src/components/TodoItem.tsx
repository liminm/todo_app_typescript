// Import React and necessary types
import React from 'react'

// Define the type for the component props using an interface
interface TodoItemProps {
    // Unique id for the todo item
    id: number
    // Title of the todo
    title: string
    // Indicates whether the todo is completed
    completed: boolean
    // Callback function when the todo is toggled
    onToggle: (id: number) => void
}

// Define the TodoItem component as a functional component
const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed, onToggle }) => {
    return (
        <div>
            <input
                type="checkbox"
                checked={completed}
                onChange={() => onToggle(id)}
            />
            <span>{title}</span>
        </div>
    )
}

// Export the component for use in other parts of the application
export default TodoItem
