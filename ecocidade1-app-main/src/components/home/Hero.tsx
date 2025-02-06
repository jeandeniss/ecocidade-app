import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Search, X } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { loading, error } = useSearch(searchQuery);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    navigate(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearching(false);
  };

  return (
    <div className="relative bg-emerald-700 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Natureza"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative max-w-3xl mx-auto text-center space-y-8">
        <div className="flex items-center justify-center space-x-3">
          <Leaf className="h-10 w-10" />
          <h1 className="text-4xl font-bold">EcoCidade</h1>
        </div>
        <p className="text-xl">
          Encontre produtos sustentáveis e faça a diferença para o planeta
        </p>
        <div className="max-w-2xl mx-auto">
          {showSearch ? (
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque produtos sustentáveis..."
                className="w-full px-6 py-3 pl-12 pr-12 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                autoFocus
                disabled={loading || isSearching}
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/70" />
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="absolute right-4 top-3.5 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              {error && (
                <div className="absolute top-full mt-2 w-full text-red-300 text-sm">
                  {error}
                </div>
              )}
            </form>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="group flex items-center justify-center space-x-3 w-full px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              <Search className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
              <span className="text-white/70 group-hover:text-white transition-colors">
                Clique para buscar produtos sustentáveis...
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};