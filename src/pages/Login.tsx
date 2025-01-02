import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { authState$ } from '../store/Observables';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const subscription = authState$.subscribe(({ user }) => {
      if (user) navigate('/home');
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), 5000); // Fallback to reset loading after 5 seconds

    try {
      await authService.login(username, password);
      clearTimeout(timeoutId); // Clear timeout if the request completes successfully
    } catch (error) {
      console.error('Login failed', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/register')}>Sign up</button>
      <h1>Login</h1>
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
        onClick={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#374151' : '',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s ease',
        }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default Login;
