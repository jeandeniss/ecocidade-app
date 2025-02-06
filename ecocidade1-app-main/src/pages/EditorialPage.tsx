import React from 'react';
import { BookOpen, Leaf, TrendingUp, FileText } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  category: 'guide' | 'news';
  imageUrl: string;
  date: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'Como escolher produtos realmente sustentáveis?',
    description: 'Um guia completo para identificar produtos verdadeiramente ecológicos e evitar o greenwashing.',
    category: 'guide',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    date: '2024-01-30'
  },
  {
    id: '2',
    title: 'Diferença entre materiais biodegradáveis e recicláveis',
    description: 'Entenda as principais diferenças e como cada tipo de material impacta o meio ambiente.',
    category: 'guide',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    date: '2024-01-28'
  },
  {
    id: '3',
    title: 'Novas regulamentações ecológicas na Europa',
    description: 'Conheça as últimas atualizações nas leis ambientais europeias e como elas afetam o consumo.',
    category: 'news',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    date: '2024-01-25'
  }
];

export const EditorialPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Dicas e Conselhos para um Consumo Sustentável
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Fique por dentro das últimas tendências, novidades e guias para um consumo mais consciente e ecológico.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-emerald-50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Guias de Compra
            </h2>
          </div>
          <p className="text-gray-600">
            Aprenda a fazer escolhas mais conscientes com nossos guias detalhados sobre produtos ecológicos.
          </p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Notícias e Tendências
            </h2>
          </div>
          <p className="text-gray-600">
            Acompanhe as últimas novidades e tendências em sustentabilidade e consumo consciente.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map(article => (
          <article
            key={article.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  article.category === 'guide'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {article.category === 'guide' ? 'Guia' : 'Notícia'}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(article.date).toLocaleDateString('pt-PT')}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {article.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {article.description}
              </p>
              
              <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                <span>Leia Mais</span>
                <Leaf className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};