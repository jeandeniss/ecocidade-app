import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Filter, 
  Leaf, 
  Heart, 
  Scale,
  AlertCircle,
  X 
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';
import { getUniqueSuggestions, addRecentSearch, getRecentSearches, clearRecentSearches, removeRecentSearch } from '../utils/searchUtils';
import { SearchHistory } from '../components/search/SearchHistory';
import { useStore } from '../store/useStore';
import { ComparisonTable } from '../components/comparison/ComparisonTable';

export const SearchComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showClearFeedback, setShowClearFeedback] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showComparisonError, setShowComparisonError] = useState(false);

  const { isAuthenticated, addToFavorites, removeFromFavorites, isFavorite } = useStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const dadosProdutosRef = doc(db, 'produtos', 'dados_produtos');
        const docSnap = await getDoc(dadosProdutosRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.produtos)) {
            const fetchedProducts: Product[] = data.produtos.map((produto: any) => ({
              id: Math.random().toString(36).substr(2, 9),
              name: produto.nome_produto || '',
              description: produto.descricao_produto || '',
              price: parseFloat(produto.preco) || 0,
              category: produto.categoria_produto || '',
              imageUrl: produto.link_imagem || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
              sustainabilityScore: 8,
              certifications: [produto.categoria_produto || 'Ecológico'],
              affiliateLink: produto.link_compra || '#',
              platform: produto.site || 'Decathlon'
            }));

            setProducts(fetchedProducts);
            setError(null);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (selectedProducts.find(p => p.id === productId)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
      setShowComparisonError(false);
    } else if (selectedProducts.length < 2) {
      setSelectedProducts([...selectedProducts, product]);
      setShowComparisonError(false);
    } else {
      setShowComparisonError(true);
      setTimeout(() => setShowComparisonError(false), 3000);
    }
  };

  const handleFavoriteClick = async (product: Product, event: React.MouseEvent) => {
    event.preventDefault();
    if (!isAuthenticated) return;
    
    try {
      setActionInProgress(product.id);
      
      if (isFavorite(product.affiliateLink)) {
        await removeFromFavorites(product.id);
      } else {
        await addToFavorites(product);
      }
    } finally {
      setActionInProgress(null);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      setSuggestions(getRecentSearches());
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    );
    setFilteredProducts(filtered);

    const uniqueSuggestions = getUniqueSuggestions(searchTerm, products);
    setSuggestions(uniqueSuggestions);
  }, [searchTerm, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addRecentSearch(searchTerm.trim());
      setSearchParams({ q: searchTerm.trim() });
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || !suggestions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : -1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          const selectedSuggestion = suggestions[selectedSuggestionIndex];
          setSearchTerm(selectedSuggestion);
          addRecentSearch(selectedSuggestion);
          setSearchParams({ q: selectedSuggestion });
          setShowSuggestions(false);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleClearHistory = () => {
    clearRecentSearches();
    setSuggestions([]);
    setShowClearFeedback(true);
    setTimeout(() => setShowClearFeedback(false), 3000);
  };

  const handleRemoveSearch = (search: string) => {
    removeRecentSearch(search);
    setSuggestions(getRecentSearches());
  };

  const handleSelectSearch = (search: string) => {
    setSearchTerm(search);
    addRecentSearch(search);
    setSearchParams({ q: search });
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <SearchIcon className="h-8 w-8 text-emerald-600" />
          <Scale className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Busque e Compare Produtos Sustentáveis
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Encontre e compare produtos ecológicos para fazer a melhor escolha
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="relative">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: lâmpada LED, produtos orgânicos, filtro de água..."
              className="w-full px-4 py-3 pl-12 pr-12 text-gray-800 bg-white border-2 border-emerald-100 rounded-full focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              autoComplete="off"
            />
            <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-2 px-4 py-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
            >
              Buscar
            </button>
          </form>

          {/* Search History */}
          {showSuggestions && !searchTerm && (
            <SearchHistory
              onSelectSearch={handleSelectSearch}
              onClearHistory={handleClearHistory}
              onRemoveSearch={handleRemoveSearch}
            />
          )}

          {/* Clear History Feedback */}
          {showClearFeedback && (
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium shadow-md animate-fade-in">
              Histórico de pesquisa apagado
            </div>
          )}

          {/* Suggestions Dropdown */}
          {showSuggestions && searchTerm && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-emerald-100 overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(suggestion);
                    addRecentSearch(suggestion);
                    setSearchParams({ q: suggestion });
                    setShowSuggestions(false);
                  }}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  className={`w-full px-4 py-3 text-left flex items-center space-x-2 transition-colors ${
                    index === selectedSuggestionIndex
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  <SearchIcon className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content with Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-t-lg" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product.id)}
                  className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                    selectedProducts.find(p => p.id === product.id)
                      ? 'ring-2 ring-emerald-500 transform scale-[1.02]'
                      : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-32 object-cover"
                    />
                    {isAuthenticated && (
                      <button
                        onClick={(e) => handleFavoriteClick(product, e)}
                        disabled={actionInProgress === product.id}
                        className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-300 ${
                          isFavorite(product.affiliateLink)
                            ? 'bg-red-50 hover:bg-red-100'
                            : 'bg-white hover:bg-red-50'
                        } ${actionInProgress === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors duration-300 ${
                            isFavorite(product.affiliateLink)
                              ? 'text-red-500 fill-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center space-x-1 mb-2">
                      <Leaf className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-600 font-medium">
                        {product.certifications[0]}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-semibold text-sm">
                        €{product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductSelect(product.id);
                        }}
                        className={`px-2 py-1 rounded-full text-xs transition-all ${
                          selectedProducts.find(p => p.id === product.id)
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {selectedProducts.find(p => p.id === product.id)
                          ? 'Selecionado'
                          : 'Comparar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Table Sidebar */}
        {selectedProducts.length > 0 && (
          <div className="lg:w-[400px] flex-shrink-0">
            <div className="sticky top-24">
              <ComparisonTable 
                products={selectedProducts}
                onRemoveProduct={handleProductSelect}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {showComparisonError && (
        <div className="fixed top-4 right-4 bg-red-50 border-l-4 border-red-400 p-3 rounded-md shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
            <p className="text-red-700 text-sm">
              Selecione apenas dois produtos para comparação
            </p>
            <button
              onClick={() => setShowComparisonError(false)}
              className="ml-3 text-red-400 hover:text-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};