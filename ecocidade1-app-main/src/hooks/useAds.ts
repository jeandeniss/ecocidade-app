import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  frequency: number;
  targetAudience: string;
}

export const useAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      const adsRef = collection(db, 'ads');
      const snapshot = await getDocs(adsRef);
      const adsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ad[];
      
      setAds(adsData);
    };

    fetchAds();
  }, []);

  const createAd = async (ad: Omit<Ad, 'id'>) => {
    const docRef = await addDoc(collection(db, 'ads'), ad);
    setAds([...ads, { ...ad, id: docRef.id }]);
  };

  const updateAd = async (id: string, data: Partial<Ad>) => {
    await updateDoc(doc(db, 'ads', id), data);
    setAds(ads.map(a => 
      a.id === id ? { ...a, ...data } : a
    ));
  };

  const deleteAd = async (id: string) => {
    await deleteDoc(doc(db, 'ads', id));
    setAds(ads.filter(a => a.id !== id));
  };

  return {
    ads,
    createAd,
    updateAd,
    deleteAd,
  };
};