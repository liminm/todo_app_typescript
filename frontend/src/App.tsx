import React, {useState} from 'react'
import Login from './components/Login'
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { useAuth } from './contexts/AuthContext'


const App: React.FC = () => {

    // const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const { token, login, logout } = useAuth();
    const [isRegistering, setIsRegistering] = useState<boolean>(false);

    // const handleLoginSuccess = (newToken: string) => {
    //     localStorage.setItem('token', newToken);
    //     setToken(newToken);
    // }

    if (!token){
        return (
            <div>
                {isRegistering ? (
                    <Register onLoginSuccess={login}/>
                ) : (
                    <Login onLoginSuccess={login}/>
                )}
                <button onClick={() => setIsRegistering((prev) => !prev)}>
                    {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
                </button>
            </div>
        )
    }



    // if (!token) {
    //     return (<div>
    //             {isRegistering ? <Register onLoginSuccess={handleLoginSuccess}/> :
    //                 <Login onLoginSuccess={handleLoginSuccess}/>}
    //             <button onClick={() => setIsRegistering((prev) => !prev)}>
    //                 {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
    //             </button>
    //         </div>);
    // }

    return <Dashboard token={token}/>;
}

export default App