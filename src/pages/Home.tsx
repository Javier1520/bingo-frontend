import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService } from '../services/GameService';
import LogoutButton from '../components/LogoutButton';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegisterToGame = async () => {
    if (loading) return;

    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), 5000); // Fallback to reset loading

    try {
      await gameService.registerToGame();
      clearTimeout(timeoutId); // Clear timeout on success
      alert('Registered to game successfully!');
      navigate('/room');
    } catch (error) {
      console.error('Failed to register', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LogoutButton />
      <div>
        <h1>Welcome {localStorage.getItem('user')}</h1>
        <button
          onClick={handleRegisterToGame}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#374151' : '',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          {loading ? 'Loading...' : 'Register for Game'}
        </button>
      </div>
    </>
  );
};

export default Home;
