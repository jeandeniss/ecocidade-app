import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAffiliates } from '../../hooks/useAffiliates';

export const AffiliateManager: React.FC = () => {
  const { affiliates, addAffiliate, updateAffiliate, deleteAffiliate } = useAffiliates();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Afiliados</h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Afiliado</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plataforma
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comissão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {affiliates.map((affiliate) => (
              <tr key={affiliate.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={affiliate.platformLogo}
                      alt={affiliate.platform}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="ml-3">{affiliate.platform}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {affiliate.commission}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {affiliate.sales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    affiliate.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {affiliate.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => setEditingId(affiliate.id)}
                    className="text-emerald-600 hover:text-emerald-700 mr-3"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteAffiliate(affiliate.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};