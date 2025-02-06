import React from 'react';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign 
} from 'lucide-react';
import { useStats } from '../../hooks/useStats';
import { StatCard } from './StatCard';
import { RevenueChart } from './RevenueChart';
import { TopProducts } from './TopProducts';

export const AdminOverview: React.FC = () => {
  const { stats, loading } = useStats();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Usuários Ativos"
          value={stats.activeUsers}
          icon={Users}
          trend={stats.usersTrend}
        />
        <StatCard
          title="Vendas do Mês"
          value={stats.monthlySales}
          icon={ShoppingCart}
          trend={stats.salesTrend}
        />
        <StatCard
          title="Comissões"
          value={`R$ ${stats.totalCommissions.toFixed(2)}`}
          icon={TrendingUp}
          trend={stats.commissionsTrend}
        />
        <StatCard
          title="Receita Premium"
          value={`R$ ${stats.premiumRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend={stats.revenueTrend}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={stats.revenueData} />
        <TopProducts products={stats.topProducts} />
      </div>
    </div>
  );
};