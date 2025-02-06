import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Affiliate {
  id: string;
  platform: string;
  platformLogo: string;
  commission: number;
  sales: number;
  isActive: boolean;
}

export const useAffiliates = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);

  useEffect(() => {
    const fetchAffiliates = async () => {
      const affiliatesRef = collection(db, 'affiliates');
      const snapshot = await getDocs(affiliatesRef);
      const affiliatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Affiliate[];
      
      setAffiliates(affiliatesData);
    };

    fetchAffiliates();
  }, []);

  const addAffiliate = async (affiliate: Omit<Affiliate, 'id'>) => {
    const docRef = await addDoc(collection(db, 'affiliates'), affiliate);
    setAffiliates([...affiliates, { ...affiliate, id: docRef.id }]);
  };

  const updateAffiliate = async (id: string, data: Partial<Affiliate>) => {
    await updateDoc(doc(db, 'affiliates', id), data);
    setAffiliates(affiliates.map(a => 
      a.id === id ? { ...a, ...data } : a
    ));
  };

  const deleteAffiliate = async (id: string) => {
    await deleteDoc(doc(db, 'affiliates', id));
    setAffiliates(affiliates.filter(a => a.id !== id));
  };

  return {
    affiliates,
    addAffiliate,
    updateAffiliate,
    deleteAffiliate,
  };
};