import React from 'react';
import { History, X, Trash2 } from 'lucide-react';
import { clearRecentSearches, getRecentSearches, addRecentSearch } from '../../utils/searchUtils';

interface SearchHistoryProps {
  onSelectSearch: (search: string) => void;
  onClearHistory: () => void;
  onRemoveSearch: (search: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  onSelectSearch,
  onClearHistory,
  onRemoveSearch,
}) => {
  const recentSearches = getRecentSearches();

  if (recentSearches.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-sm text-gray-500">
          <History className="h-4 w-4 mr-1" />
          <span>Pesquisas recentes</span>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span>Limpar histórico</span>
        </button>
      </div>
      <div className="space-y-1">
        {recentSearches.map((search, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors group"
          >
            <button
              onClick={() => onSelectSearch(search)}
              className="flex-1 text-left text-gray-700 hover:text-emerald-600"
            >
              {search}
            </button>
            <button
              onClick={() => onRemoveSearch(search)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
              title="Remover do histórico"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};