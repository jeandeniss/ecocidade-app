import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-8">
          <FileText className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-800">Termos e Condições de Uso</h1>
        </div>

        <div className="prose prose-emerald max-w-none">
          <p className="text-gray-600 mb-8">
            Ao utilizar a Ecocidade, você concorda com os seguintes termos e condições...
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              1. Uso Permitido da Plataforma
            </h2>
            <p className="text-gray-600 mb-4">
              A Ecocidade é uma plataforma dedicada à promoção de produtos sustentáveis e ecológicos.
              Ao utilizar nossos serviços, você concorda em:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Fornecer informações verdadeiras e precisas</li>
              <li>Não utilizar a plataforma para fins ilegais ou não autorizados</li>
              <li>Respeitar os direitos de propriedade intelectual</li>
              <li>Não interferir com o funcionamento normal da plataforma</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              2. Responsabilidades do Usuário
            </h2>
            <p className="text-gray-600 mb-4">
              Como usuário da Ecocidade, você é responsável por:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Manter a segurança de suas credenciais de acesso</li>
              <li>Todas as atividades realizadas em sua conta</li>
              <li>Respeitar os direitos de outros usuários</li>
              <li>Seguir as diretrizes da comunidade</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              3. Privacidade e Coleta de Dados
            </h2>
            <p className="text-gray-600 mb-4">
              Nós levamos sua privacidade a sério. Nossa coleta e uso de dados pessoais é regida por:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Nossa Política de Privacidade</li>
              <li>Regulamentos de proteção de dados aplicáveis</li>
              <li>Consentimento explícito do usuário</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              4. Regras para Postagens e Comentários
            </h2>
            <p className="text-gray-600 mb-4">
              Ao interagir na plataforma, você concorda em não:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Publicar conteúdo ofensivo ou discriminatório</li>
              <li>Fazer spam ou publicidade não autorizada</li>
              <li>Compartilhar informações falsas ou enganosas</li>
              <li>Violar direitos de terceiros</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              5. Política de Encerramento de Conta
            </h2>
            <p className="text-gray-600 mb-4">
              A Ecocidade reserva-se o direito de encerrar contas que:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Violem nossos termos de uso</li>
              <li>Realizem atividades fraudulentas</li>
              <li>Prejudiquem outros usuários</li>
              <li>Comprometam a segurança da plataforma</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};