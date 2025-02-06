import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Buscar produtos sustentáveis...",
  className = ""
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 pr-4 text-gray-800 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      />
      <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      <button
        type="submit"
        className="absolute right-2 top-1.5 px-4 py-1 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
      >
        Buscar
      </button>
    </form>
  );
};