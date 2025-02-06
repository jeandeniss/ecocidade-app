import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AffiliateManager } from '../components/admin/AffiliateManager';
import { AdvertisingManager } from '../components/admin/AdvertisingManager';
import { SubscriptionManager } from '../components/admin/SubscriptionManager';
import { useAuth } from '../hooks/useAuth';

const ADMIN_CREDENTIALS = {
  username: 'JD',
  password: 'password'
};

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_CREDENTIALS.username;

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/affiliates" element={<AffiliateManager />} />
            <Route path="/advertising" element={<AdvertisingManager />} />
            <Route path="/subscriptions" element={<SubscriptionManager />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};