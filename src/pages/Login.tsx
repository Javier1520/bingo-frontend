import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login: setAuth } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      setAuth(username, response.data.auth_token);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;