import React, { useState, useEffect } from 'react';
import { Award, Star, TrendingUp, ExternalLink, Heart } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Product } from '../../types';
import { useStore } from '../../store/useStore';

export const FeaturedProducts: React.FC = () => {
  const { user, isAuthenticated, addToFavorites, removeFromFavorites, isFavorite } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const dadosProdutosRef = doc(db, 'produtos', 'dados_produtos');
      const docSnap = await getDoc(dadosProdutosRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.produtos)) {
          const allProducts: Product[] = data.produtos.map((produto: any) => ({
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

          const randomProducts = allProducts
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);

          setProducts(randomProducts);
          setError(null);
        } else {
          throw new Error('Estrutura de dados inválida');
        }
      } else {
        throw new Error('Documento não encontrado');
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError('Erro ao carregar produtos em destaque');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const handleFavoriteClick = async (product: Product) => {
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-800">Produtos em Destaque</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse">
              <div className="h-60 bg-gray-200 rounded-t-lg" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchFeaturedProducts}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-800">Produtos em Destaque</h2>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-emerald-500 mr-1" />
            <span>Popularidade</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
            <span>Preço</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-[408px] group relative"
          >
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              {isAuthenticated && (
                <button
                  onClick={() => handleFavoriteClick(product)}
                  disabled={actionInProgress === product.id}
                  className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md transition-all duration-300 ${
                    isFavorite(product.affiliateLink)
                      ? 'bg-red-50 hover:bg-red-100'
                      : 'hover:bg-red-50'
                  } ${actionInProgress === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors duration-300 ${
                      isFavorite(product.affiliateLink)
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  />
                </button>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                  >
                    {cert}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-emerald-600">
                  €{product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  via {product.platform}
                </span>
              </div>
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 mt-5"
              >
                <span>Ver Produto</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};