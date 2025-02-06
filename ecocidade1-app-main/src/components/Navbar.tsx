import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Search, User, X, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useStore();
  const { logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        navigate('/');
      } else {
        console.error('Erro ao fazer logout:', result.error);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="bg-emerald-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8" />
            <span className="text-xl font-bold">EcoCidade</span>
          </Link>

          <div className="flex-1 max-w-2xl mx-8 relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produtos sustentáveis..."
                  className="w-full px-4 py-2 pl-10 pr-10 rounded-full bg-emerald-600 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  autoFocus
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-emerald-200" />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="absolute right-3 top-2.5 text-emerald-200 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center space-x-2 text-emerald-200 hover:text-white transition-colors"
              >
                <Search className="h-5 w-5" />
                <span className="text-sm">Buscar produtos...</span>
              </button>
            )}
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:text-emerald-200 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="text-sm hidden md:block">{user?.username}</span>
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
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-500 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};