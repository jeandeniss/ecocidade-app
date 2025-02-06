import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Subscription {
  id: string;
  user: {
    email: string;
    username: string;
  };
  startDate: string;
  status: 'active' | 'cancelled';
  amount: number;
}

interface SubscriptionStats {
  activeSubscribers: number;
  monthlyRevenue: number;
  growthRate: number;
}

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({
    activeSubscribers: 0,
    monthlyRevenue: 0,
    growthRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const subscriptionsRef = collection(db, 'subscriptions');
        const q = query(subscriptionsRef, orderBy('startDate', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        
        const subscriptionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Subscription[];

        setSubscriptions(subscriptionsData);

        // Calculate stats
        const activeCount = subscriptionsData.filter(s => s.status === 'active').length;
        const monthlyRevenue = activeCount * 5; // $5 per subscription
        const previousCount = 0; // TODO: Get previous month's count
        const growthRate = previousCount === 0 ? 100 : ((activeCount - previousCount) / previousCount) * 100;

        setStats({
          activeSubscribers: activeCount,
          monthlyRevenue,
          growthRate
        });
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return { subscriptions, stats, loading };
};