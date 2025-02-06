import React, { useState, useEffect, KeyboardEvent } from 'react';
import { 
  Leaf, 
  Globe,
  Target,
  TrendingUp,
  Search,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { RecommendedProducts } from '../components/home/RecommendedProducts';
import { PartnersBanner } from '../components/home/PartnersBanner';
import { useStore } from '../store/useStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';
import { getUniqueSuggestions, addRecentSearch, getRecentSearches, clearRecentSearches, removeRecentSearch } from '../utils/searchUtils';
import { SearchHistory } from '../components/search/SearchHistory';

const HomePage: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products for suggestions
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const dadosProdutosRef = doc(db, 'produtos', 'dados_produtos');
        const docSnap = await getDoc(dadosProdutosRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.produtos)) {
            const fetchedProducts = data.produtos.map((produto: any) => ({
              id: Math.random().toString(36).substr(2, 9),
              name: produto.nome_produto || '',
              description: produto.descricao_produto || '',
              price: parseFloat(produto.preco) || 0,
              category: produto.categoria_produto || '',
              imageUrl: produto.link_imagem || '',
              sustainabilityScore: 8,
              certifications: [produto.categoria_produto || 'Ecológico'],
              affiliateLink: produto.link_compra || '#',
              platform: produto.site || ''
            }));
            setProducts(fetchedProducts);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Update suggestions when search query changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions(getRecentSearches());
    } else {
      const uniqueSuggestions = getUniqueSuggestions(searchTerm, products);
      setSuggestions(uniqueSuggestions);
    }
  }, [searchTerm, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addRecentSearch(searchTerm.trim());
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
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
          navigate(`/search?q=${encodeURIComponent(selectedSuggestion)}`);
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
    setSuggestions(getRecentSearches());
  };

  const handleRemoveSearch = (search: string) => {
    removeRecentSearch(search);
    setSuggestions(getRecentSearches());
  };

  const handleSelectSearch = (search: string) => {
    setSearchTerm(search);
    addRecentSearch(search);
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative bg-emerald-700 text-white py-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Natureza"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Leaf className="h-12 w-12" />
              <h1 className="text-5xl font-bold">EcoCidade</h1>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <p className="text-xl max-w-3xl mx-auto mb-4">
                Pioneiros em Soluções Verdes para um Consumo Responsável
              </p>
              <span className="text-lg text-emerald-200 font-light tracking-wide">
                Tecnologia inteligente para um futuro sustentável
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-emerald-50 to-transparent"></div>
        </div>
        <div className="relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-emerald-100 rounded-full mb-4">
              <Globe className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Missão</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A Ecocidade tem como missão facilitar a busca, comparação e compra de produtos ecológicos, 
              conectando consumidores a opções sustentáveis de forma simples, eficiente e transparente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6 transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Busca Otimizada</h3>
              </div>
              <p className="text-gray-600">
                Utilizando tecnologias avançadas de IA, oferecemos uma experiência de busca otimizada, 
                garantindo resultados relevantes e atualizados.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Melhor Custo-Benefício</h3>
              </div>
              <p className="text-gray-600">
                Comparamos produtos e verificamos disponibilidade em lojas parceiras, 
                garantindo as melhores opções para nossos usuários.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Leaf className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Impacto Positivo</h3>
              </div>
              <p className="text-gray-600">
                Nosso objetivo é ser referência em consumo responsável, promovendo escolhas 
                informadas para um futuro mais sustentável.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Banner */}
      <PartnersBanner />

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-white rounded-xl transform -rotate-1">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-emerald-50/50 rounded-full blur-xl"></div>
          </div>
          
          <div className="relative bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 border border-emerald-100/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Search className="h-6 w-6 text-emerald-600" />
                Encontre Produtos Sustentáveis
              </h2>
              <p className="text-gray-600 mt-2">
                Digite o produto que procura e nossa IA encontrará as melhores opções sustentáveis
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                      setSelectedSuggestionIndex(-1);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ex: lâmpada LED, produtos orgânicos, filtro de água..."
                    className="w-full pl-12 pr-12 py-3 text-base rounded-full border-2 border-emerald-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/90"
                    role="combobox"
                    aria-expanded={showSuggestions}
                    aria-controls="search-suggestions"
                    aria-activedescendant={
                      selectedSuggestionIndex >= 0
                        ? `suggestion-${selectedSuggestionIndex}`
                        : undefined
                    }
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* Search History */}
              {showSuggestions && !searchTerm && (
                <SearchHistory
                  onSelectSearch={handleSelectSearch}
                  onClearHistory={handleClearHistory}
                  onRemoveSearch={handleRemoveSearch}
                />
              )}

              {/* Suggestions Dropdown */}
              {showSuggestions && searchTerm && suggestions.length > 0 && (
                <div
                  id="search-suggestions"
                  className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-emerald-100 overflow-hidden"
                  role="listbox"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      id={`suggestion-${index}`}
                      onClick={() => handleSelectSearch(suggestion)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                      className={`w-full px-4 py-3 text-left hover:bg-emerald-50 text-gray-700 flex items-center space-x-2 transition-colors duration-200 ${
                        index === selectedSuggestionIndex
                          ? 'bg-emerald-50 text-emerald-700'
                          : ''
                      }`}
                      role="option"
                      aria-selected={index === selectedSuggestionIndex}
                    >
                      <Search className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mt-6 flex justify-center gap-6">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700">
                <div className="p-1.5 rounded-full bg-emerald-100">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium">Busca Inteligente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the sections */}
      {user && <RecommendedProducts />}
      <FeaturedProducts />

      {/* Consolidation Text */}
      <div className="text-center mt-8">
        <p className="text-lg text-gray-600">
          Consolidamos a Ecocidade como referência digital em consumo responsável, 
          promovendo escolhas informadas e contribuindo para um futuro mais verde. 
          <span className="inline-flex items-center ml-2 text-emerald-600">
            <Leaf className="h-5 w-5 mr-1" />
            <span className="font-medium">Junte-se a nós!</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default HomePage;