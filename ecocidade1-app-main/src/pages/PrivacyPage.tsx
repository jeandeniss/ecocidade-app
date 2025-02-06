import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-800">Política de Privacidade</h1>
        </div>

        <div className="prose prose-emerald max-w-none">
          <p className="text-gray-600 mb-8">
            Respeitamos sua privacidade e garantimos transparência no uso dos seus dados.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              1. Dados que Coletamos
            </h2>
            <p className="text-gray-600 mb-4">
              Coletamos os seguintes tipos de informações:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Informações de cadastro (nome, email, etc.)</li>
              <li>Dados de uso da plataforma</li>
              <li>Preferências de produtos</li>
              <li>Histórico de compras</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              2. Como Utilizamos seus Dados
            </h2>
            <p className="text-gray-600 mb-4">
              Seus dados são utilizados para:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Personalizar sua experiência</li>
              <li>Processar pedidos e pagamentos</li>
              <li>Enviar atualizações relevantes</li>
              <li>Melhorar nossos serviços</li> </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              3. Proteção de Informações Pessoais
            </h2>
            <p className="text-gray-600 mb-4">
              Implementamos medidas de segurança para proteger seus dados:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Criptografia de dados sensíveis</li>
              <li>Controles de acesso rigorosos</li>
              <li>Monitoramento de segurança contínuo</li>
              <li>Backups regulares</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              4. Direitos do Usuário
            </h2>
            <p className="text-gray-600 mb-4">
              Você tem direito a:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Solicitar correções de informações</li>
              <li>Excluir sua conta e dados</li>
              <li>Optar por não receber comunicações</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              5. Compartilhamento de Dados
            </h2>
            <p className="text-gray-600 mb-4">
              Seus dados podem ser compartilhados apenas com:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Parceiros de processamento de pagamento</li>
              <li>Serviços de entrega</li>
              <li>Autoridades legais quando requerido</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              6. Contato
            </h2>
            <p className="text-gray-600">
              Para questões sobre privacidade, entre em contato:
              <br />
              Email: contato@ecocidade.com
              <br />
              Telefone: +351 925 675 991
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};