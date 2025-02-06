import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Stats {
  activeUsers: number;
  monthlySales: number;
  totalCommissions: number;
  premiumRevenue: number;
  usersTrend: number;
  salesTrend: number;
  commissionsTrend: number;
  revenueTrend: number;
  revenueData: Array<{
    date: string;
    value: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch stats from Firestore
        const statsRef = collection(db, 'stats');
        const querySnapshot = await getDocs(statsRef);
        const statsData = querySnapshot.docs[0].data() as Stats;

        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};