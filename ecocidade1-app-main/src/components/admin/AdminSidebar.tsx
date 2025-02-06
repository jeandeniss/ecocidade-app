import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HandshakeIcon, 
  SpeakerIcon, 
  Crown,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Visão Geral' },
  { path: '/admin/affiliates', icon: HandshakeIcon, label: 'Afiliados' },
  { path: '/admin/advertising', icon: SpeakerIcon, label: 'Publicidade' },
  { path: '/admin/subscriptions', icon: Crown, label: 'Assinaturas' },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-emerald-700">EcoCidade</h1>
        <p className="text-sm text-gray-600">Painel Administrativo</p>
      </div>

      <nav className="mt-6">
        {menuItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 ${
              location.pathname === path ? 'bg-emerald-50 text-emerald-700' : ''
            }`}
          >
            <Icon className="h-5 w-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-6">
        <button
          onClick={logout}
          className="flex items-center text-gray-700 hover:text-red-600"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </button>
      </div>
    </div>
  );
};