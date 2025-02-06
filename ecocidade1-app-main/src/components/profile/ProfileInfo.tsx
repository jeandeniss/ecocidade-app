import React, { useState } from 'react';
import { User, Edit2, Save } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User as UserType } from '../../types';
import { useStore } from '../../store/useStore';

interface ProfileInfoProps {
  user: UserType;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const { setUser } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        username,
      });

      setUser({ ...user, username });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Informações Pessoais</h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              <span>Salvar</span>
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" />
              <span>Editar</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome de usuário
          </label>
          {isEditing ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          ) : (
            <p className="text-gray-800">{username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <p className="text-gray-800">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status da conta
          </label>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-sm ${
              user.isPremium
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {user.isPremium ? 'Premium' : 'Básico'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};