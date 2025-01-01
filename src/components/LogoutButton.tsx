import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';

const LogoutButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), 5000); // Fallback to reset loading

    try {
      await authService.logout();
      clearTimeout(timeoutId); // Clear timeout on success
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        backgroundColor: loading ? '#374151' : '',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.3s ease',
      }}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;
