import React, { useState, useEffect } from 'react';
import { Scale, AlertCircle, Filter, Leaf, X, Heart } from 'lucide-react';
import { ComparisonTable } from '../components/comparison/ComparisonTable';
import { Product } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useStore } from '../store/useStore';

export const ComparePage: React.FC = () => {
  const { isAuthenticated, addToFavorites, removeFromFavorites, isFavorite, loadFavorites } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Load user's favorites when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated, loadFavorites]);

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
              certifications: [produto.categoria_produto || 'Ecológico'],
              affiliateLink: produto.link_compra || '#',
              platform: produto.site || 'Decathlon'
            }));

            setProducts(
              selectedCategory
                ? fetchedProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase())
                : fetchedProducts
            );
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
  }, [selectedCategory]);

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (selectedProducts.find(p => p.id === productId)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
      setShowError(false);
    } else if (selectedProducts.length < 2) {
      setSelectedProducts([...selectedProducts, product]);
      setShowError(false);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleFavoriteClick = async (product: Product, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering product selection
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

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'ecologico', name: 'Ecológico' },
    { id: 'sustentavel', name: 'Sustentável' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Scale className="h-7 w-7 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">Compare Produtos Sustentáveis</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
          Selecione até dois produtos para comparar suas características.
        </p>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="h-4 w-4 text-emerald-600" />
          <h2 className="text-base font-semibold text-gray-800">Filtrar por Categoria</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id === 'all' ? null : category.id);
                setSelectedProducts([]);
              }}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                (category.id === 'all' && !selectedCategory) || selectedCategory === category.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
            >
              {category.name}
            </button>
          ))}
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
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
      {showError && (
        <div className="fixed top-4 right-4 bg-red-50 border-l-4 border-red-400 p-3 rounded-md shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
            <p className="text-red-700 text-sm">
              Selecione apenas dois produtos para comparação
            </p>
            <button
              onClick={() => setShowError(false)}
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