import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { register, login } from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const handleRegister = async () => {
    try {
      setError(null);
      await register(username, password);

      const loginResponse = await login(username, password);
      setAuth(username, loginResponse.data.auth_token);
      navigate('/home');

    } catch (error) {
      console.error('Register failed:', error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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