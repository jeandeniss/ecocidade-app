import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Search, 
  User, 
  Menu,
  X,
  Home,
  HandshakeIcon
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const { isAuthenticated, user } = useStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        navigate('/');
        setShowUserMenu(false);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="bg-emerald-700 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8" />
            <span className="text-xl font-bold">EcoCidade</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:text-emerald-200 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Início</span>
            </Link>
            <Link 
              to="/search" 
              className="flex items-center space-x-2 hover:text-emerald-200 transition-colors"
            >
              <Search className="h-5 w-5" />
              <span>Buscar e Comparar</span>
            </Link>
            <Link 
              to="/partners" 
              className="flex items-center space-x-2 hover:text-emerald-200 transition-colors"
            >
              <HandshakeIcon className="h-5 w-5" />
              <span>Parceiros</span>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:text-emerald-200 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden md:block">{user?.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 hover:text-emerald-200 transition-colors"
              >
                <User className="h-6 w-6" />
                <span className="hidden md:block">Entrar</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-600">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 hover:text-emerald-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Início</span>
              </Link>
              <Link 
                to="/search" 
                className="flex items-center space-x-2 hover:text-emerald-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="h-5 w-5" />
                <span>Buscar e Comparar</span>
              </Link>
              <Link 
                to="/partners" 
                className="flex items-center space-x-2 hover:text-emerald-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <HandshakeIcon className="h-5 w-5" />
                <span>Parceiros</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};