import React, {useEffect, useState} from 'react'
import TodoItem from './TodoItem'
import AddTodo from './AddTodo'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useSnackbar } from 'notistack'

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
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const { enqueueSnackbar } = useSnackbar()

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
                enqueueSnackbar(`Error fetching todos: ${err.message}`, { variant: 'error' });
            } finally {
                setLoading(false);
            }
        }
        fetchTodos();
    }, [token, enqueueSnackbar]);


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
            enqueueSnackbar('Todo updated successfully', { variant: 'success' })
        } catch (err: any) {
            console.error(err)
            enqueueSnackbar(`Error updating todo: ${err.message}`, { variant: 'error' })
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
            enqueueSnackbar('Todo added successfully', { variant: 'success' })
        } catch (err: any) {
            console.error(err)
            enqueueSnackbar(`Error adding todo: ${err.message}`, { variant: 'error' })
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
            enqueueSnackbar('Todo deleted successfully', { variant: 'success' })
        } catch (err: any) {
            console.error(err)
            enqueueSnackbar(`Error deleting todo: ${err.message}`, { variant: 'error' })
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };


    const filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase())
        let matchesStatus = true
        if (filterStatus === 'completed'){
            matchesStatus = todo.completed
        } else if (filterStatus === 'pending'){
            matchesStatus = !todo.completed
        }
        return matchesSearch && matchesStatus
    })

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom>
                Your Dashboard
            </Typography>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="secondary" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
            <Box mb={2} display="flex" justifyContent="space-between">
                <TextField
                    label="Search Todos"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    sx={{mr: 2}}
                />
                <FormControl variant="outlined" sx={{minWidth: 120}}>
                    <InputLabel id="filter-label">Status</InputLabel>
                    <Select
                        labelId="filter-label"
                        label="Status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <AddTodo onAdd={handleAddTodo}/>
            {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress/>
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{my: 2}}>
                    Error: {error}
                </Alert>
            )}
            {!loading && !error && filteredTodos.length === 0 && (
                <Typography variant="body1" align="center" sx={{my: 2}}>
                    No todos found.
                </Typography>
            )}
            {!loading && !error && filteredTodos.map((todo) => (
                <TodoItem
                    key={todo._id}
                    _id={todo._id}
                    title={todo.title}
                    completed={todo.completed}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />
            ))}
        </Container>
    )
}

export default Dashboard