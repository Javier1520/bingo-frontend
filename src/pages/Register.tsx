import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { register } from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login: setAuth } = useAuth();

  const handleRegister = async () => {
    try {
      const response = await register(username, password);
      setAuth(username, response.data.auth_token);
    } catch (error) {
      console.error('Register failed', error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
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
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;