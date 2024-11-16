import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        navigate('/login');
      }
    };

    handleLogout();
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
