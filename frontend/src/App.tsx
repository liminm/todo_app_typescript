import React, {useState} from 'react'
import Login from './components/Login'
import Register from './components/Register';
import Dashboard from './components/Dashboard';


const App: React.FC = () => {

    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isRegistering, setIsRegistering] = useState<boolean>(false);

    const handleLoginSuccess = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }


    if (!token) {
        return (<div>
                {isRegistering ? <Register onLoginSuccess={handleLoginSuccess}/> :
                    <Login onLoginSuccess={handleLoginSuccess}/>}
                <button onClick={() => setIsRegistering((prev) => !prev)}>
                    {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
                </button>
            </div>);
    }

    return <Dashboard token={token}/>;
}

export default App