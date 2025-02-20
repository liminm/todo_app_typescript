import React, {useEffect, useState} from 'react'
import TodoItem from './TodoItem'
import AddTodo from './AddTodo'


interface Todo {
    _id: string
    title: string
    completed: boolean
}

interface DashboardProps {
    // JWT token for authenticating API requests
    token: string
}

const Dashboard: React.FC<DashboardProps> = ({token}) => {
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    useEffect(() => {
        const fetchTodos = async () => {
            // if (!token) return; // Ensure token is available
            setLoading(true);
            setError("");
            try {
                const response = await fetch('http://localhost:5000/api/v1/todos', {
                    method: 'GET', headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTodos(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTodos();
    }, [token]);


    const handleToggle = async (id: string) => {
        const todo = todos.find((t) => t._id === id)
        if (!todo) return

        const updatedTodo = {...todo, completed: !todo.completed}
        try {
            const response = await fetch(`http://localhost:5000/api/v1/todos/${id}`, {
                method: 'PUT', headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
                }, body: JSON.stringify(updatedTodo)
            })
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            setTodos((prevTodos) => prevTodos.map((t) => (t._id === id ? updatedTodo : t)))
        } catch (err: any) {
            console.error(err)
        }
    }

    const handleAddTodo = async (title: string) => {
        const newTodo = {title, completed: false}
        try {
            const response = await fetch(`http://localhost:5000/api/v1/todos`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
                }, body: JSON.stringify(newTodo)
            })
            if (!response.ok) {
                throw new Error('Failed to update todo')
            }
            const createdTodo = await response.json()
            setTodos((prevTodos) => [...prevTodos, createdTodo])
        } catch (err: any) {
            console.error(err)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/todos/${id}`, {
                method: 'DELETE', headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) {
                throw new Error('Failed to delete todo')
            }
            setTodos((prevTodos) => prevTodos.filter((t) => t._id !== id))
        } catch (err: any) {
            console.error(err)
        }
    }

    return (<div>
        <h1>Your Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
        <AddTodo onAdd={handleAddTodo}/>
        {loading && <p>Loading todos...</p>}
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
        {!loading && !error && todos.length === 0 && <p>No todos found.</p>}
        {!loading && !error && todos.map((todo) => (<TodoItem
            key={todo._id}
            _id={todo._id}
            title={todo.title}
            completed={todo.completed}
            onToggle={handleToggle}
            onDelete={handleDelete}
        />))}
    </div>)
}

export default Dashboard