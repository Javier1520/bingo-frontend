import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { register } from '../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setError(null);
      await register(username, password);
      await authService.login(username, password);

      navigate('/home');
    } catch (error) {
      console.error('Register failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/login')}>Login</button>
      <h1>Sign up</h1>
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
      <button onClick={handleRegister}>Sign up</button>
    </div>
  );
};

export default Register;
