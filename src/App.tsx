import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Logout from './pages/Logout';
import Room from './pages/Room';
import ProtectedRoute from './components/ProtectedRoute';



const App = () => {
  return (

      <Router>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/room" element={<Room />} />
          <Route path="/home" element={
                            <ProtectedRoute>
                              <Home />
                            </ProtectedRoute>
            }
          />
        </Routes>
      </Router>

  );
};

export default App;

