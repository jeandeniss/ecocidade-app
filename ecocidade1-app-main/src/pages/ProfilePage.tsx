import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ProfileInfo } from '../components/profile/ProfileInfo';
import { FavoritesList } from '../components/profile/FavoritesList';
import { SubscriptionManager } from '../components/profile/SubscriptionManager';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <ProfileInfo user={user!} />
          <FavoritesList />
        </div>
        
        <div>
          <SubscriptionManager user={user!} />
        </div>
      </div>
    </div>
  );
};