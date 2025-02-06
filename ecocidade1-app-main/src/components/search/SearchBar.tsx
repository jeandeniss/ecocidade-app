import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1 max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar produtos sustentáveis..."
          className="w-full px-4 py-2 pl-10 pr-10 text-white bg-emerald-600/50 rounded-full placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-emerald-200" />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2.5 text-emerald-200 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
};