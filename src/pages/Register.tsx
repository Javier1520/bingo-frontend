import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { register } from '../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (loading) return;

    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), 5000); // Fallback to reset loading

    try {
      setError(null);
      await register(username, password);
      await authService.login(username, password);

      clearTimeout(timeoutId); // Clear timeout on success
      navigate('/home');
    } catch (error) {
      console.error('Register failed:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
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
      <button
        onClick={handleRegister}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#374151' : '',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s ease',
        }}
      >
        {loading ? 'Signing up...' : 'Sign up'}
      </button>
    </div>
  );
};

export default Register;
