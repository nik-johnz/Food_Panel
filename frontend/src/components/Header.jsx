import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/AuthContext';
import axios from '../lib/axiosInstance';
import { Menu, LogOut, Users, Home } from 'lucide-react';

const Header = () => {
  const { role, updateRole, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      updateRole(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto">
        <nav className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <Menu className="h-6 w-6 text-purple-600 group-hover:rotate-180 transition-transform duration-300" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Food Menu
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Menu</span>
            </Link>

            {isAdmin && (
              <Link 
                to="/users" 
                className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Manage Users</span>
              </Link>
            )}

            {role ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 
                         text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all 
                         shadow-md hover:shadow-lg active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="relative inline-flex items-center px-6 py-2.5 overflow-hidden rounded-lg 
                         bg-purple-600 text-white transition-all hover:bg-purple-700 active:scale-95
                         shadow-md hover:shadow-lg group"
              >
                <span className="relative">Login</span>
                <div className="absolute inset-0 flex justify-end items-center pr-3 transition-transform duration-300 transform translate-x-full group-hover:translate-x-0">
                  →
                </div>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;