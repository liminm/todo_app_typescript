import React, {useState} from 'react';

interface LoginProps {
    onLoginSuccess: (token: string) => void;
}

const Register: React.FC<LoginProps> = ({onLoginSuccess}) => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, email, password})
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            } else {
                onLoginSuccess(data.token);
                console.log('Registered successfully');
            }
        } catch (err) {
            setError('An error occurred during registration');
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;