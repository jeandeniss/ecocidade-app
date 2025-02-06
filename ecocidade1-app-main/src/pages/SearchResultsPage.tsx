import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Leaf, AlertCircle, Sparkles } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';

export const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, suggestions, analysis, loading, error } = useSearch(query);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro na busca</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar para a página inicial</span>
          </button>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Nenhuma busca realizada
          </h2>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar para a página inicial</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Resultados para "{query}"
        </h1>
      </div>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sustainability Score */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              Análise de Sustentabilidade
            </h2>
            <span className="text-2xl font-bold text-emerald-600">
              {analysis.sustainabilityScore}/10
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{
                width: `${(analysis.sustainabilityScore / 10) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-emerald-600" />
            Impacto Ambiental
          </h2>
          <p className="text-gray-600">{analysis.environmentalImpact}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          Recomendações
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
            >
              <div className="p-1 bg-emerald-100 rounded-full">
                <Leaf className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-emerald-600 font-semibold">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Leaf className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm text-emerald-600">
                      Score: {product.sustainabilityScore}/10
                    </span>
                  </div>
                </div>
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Ver Produto
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};