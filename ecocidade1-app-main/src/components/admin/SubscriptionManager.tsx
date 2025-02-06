import React from 'react';
import { Users, DollarSign, TrendingUp } from 'lucide-react';
import { useSubscriptions } from '../../hooks/useSubscriptions';

export const SubscriptionManager: React.FC = () => {
  const { subscriptions, stats, loading } = useSubscriptions();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assinantes Ativos</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.activeSubscribers}</h3>
            </div>
            <Users className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Receita Mensal</p>
              <h3 className="text-2xl font-bold text-gray-800">
                R$ {stats.monthlyRevenue.toFixed(2)}
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taxa de Crescimento</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.growthRate}%
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Assinaturas Recentes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Início
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subscription.user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subscription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {subscription.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};