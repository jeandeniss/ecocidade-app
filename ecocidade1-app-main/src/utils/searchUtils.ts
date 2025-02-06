import { Product } from '../types';

export const getUniqueSuggestions = (
  searchTerm: string,
  products: Product[],
  maxSuggestions: number = 5
): string[] => {
  if (!searchTerm.trim()) return [];

  const searchLower = searchTerm.toLowerCase();
  
  // Get unique product names
  const uniqueNames = new Set<string>();
  
  // Add product names that match the search term
  products.forEach(product => {
    if (product.name.toLowerCase().includes(searchLower)) {
      uniqueNames.add(product.name);
    }
  });

  // Convert to array and sort alphabetically
  return Array.from(uniqueNames)
    .sort()
    .slice(0, maxSuggestions);
};

// Store recent searches in localStorage
const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;

export const addRecentSearch = (search: string): void => {
  const recentSearches = getRecentSearches();
  const newSearches = [
    search,
    ...recentSearches.filter(s => s.toLowerCase() !== search.toLowerCase())
  ].slice(0, MAX_RECENT_SEARCHES);
  
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
};

export const getRecentSearches = (): string[] => {
  try {
    const searches = localStorage.getItem(RECENT_SEARCHES_KEY);
    return searches ? JSON.parse(searches) : [];
  } catch {
    return [];
  }
};

export const clearRecentSearches = (): void => {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
};

export const removeRecentSearch = (searchToRemove: string): void => {
  const recentSearches = getRecentSearches();
  const newSearches = recentSearches.filter(
    search => search.toLowerCase() !== searchToRemove.toLowerCase()
  );
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
};