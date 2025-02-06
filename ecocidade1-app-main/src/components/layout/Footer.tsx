import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Mail, Phone, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-bold">EcoCidade</span>
            </div>
            <p className="text-emerald-100 text-sm">
              Sua plataforma de produtos sustentáveis em Portugal
            </p>
          </div>

          {/* Links Importantes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Importantes</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-emerald-100 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-emerald-100 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-200" />
                <a href="mailto:info.ecocidade@gmail.com" className="text-emerald-100 hover:text-white transition-colors">
                    contato@ecocidade.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-200" />
                <a href="tel:+351925675991" className="text-emerald-100 hover:text-white transition-colors">
                  +351 925 675 991
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-700 mt-8 pt-8 text-center text-emerald-200 text-sm">
          <p>&copy; {new Date().getFullYear()} EcoCidade. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};