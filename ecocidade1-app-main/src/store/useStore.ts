import { create } from 'zustand';
import { User, Cart, Product, CartItem } from '../types';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Store {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  cart: Cart;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  favorites: Product[];
  favoritesLoading: boolean;
  favoritesError: string | null;
  addToFavorites: (product: Product) => Promise<boolean>;
  removeFromFavorites: (productId: string) => Promise<boolean>;
  clearAllFavorites: () => Promise<boolean>;
  isFavorite: (affiliateLink: string) => boolean;
  loadFavorites: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  isAuthenticated: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  cart: { items: [], total: 0 },
  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.items.find(item => item.product.id === product.id);

    if (existingItem) {
      const updatedItems = cart.items.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      const total = calculateTotal(updatedItems);
      set({ cart: { items: updatedItems, total } });
    } else {
      const updatedItems = [...cart.items, { product, quantity: 1 }];
      const total = calculateTotal(updatedItems);
      set({ cart: { items: updatedItems, total } });
    }
  },
  removeFromCart: (productId) => {
    const { cart } = get();
    const updatedItems = cart.items.filter(item => item.product.id !== productId);
    const total = calculateTotal(updatedItems);
    set({ cart: { items: updatedItems, total } });
  },
  updateQuantity: (productId, quantity) => {
    const { cart } = get();
    if (quantity < 1) return;

    const updatedItems = cart.items.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    const total = calculateTotal(updatedItems);
    set({ cart: { items: updatedItems, total } });
  },
  clearCart: () => {
    set({ cart: { items: [], total: 0 } });
  },
  favorites: [],
  favoritesLoading: false,
  favoritesError: null,
  addToFavorites: async (product) => {
    const { user, favorites } = get();
    if (!user) return false;

    try {
      set({ favoritesLoading: true, favoritesError: null });
      const userRef = doc(db, 'users', user.id);
      
      // Verificar se o produto já existe nos favoritos usando affiliateLink
      const existingProduct = favorites.find(p => p.affiliateLink === product.affiliateLink);
      if (existingProduct) {
        set({ favoritesError: 'Este produto já está nos favoritos' });
        return false;
      }

      // Verificar no banco de dados também
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentFavorites = (userData.favorites || []) as Product[];
        
        if (currentFavorites.some(p => p.affiliateLink === product.affiliateLink)) {
          set({ favoritesError: 'Este produto já está nos favoritos' });
          return false;
        }
      }

      // Adicionar o produto aos favoritos
      await updateDoc(userRef, {
        favorites: arrayUnion(product)
      });

      // Atualizar o estado local
      set(state => ({
        favorites: [...state.favorites, product],
        favoritesError: null
      }));

      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      set({ favoritesError: 'Erro ao adicionar aos favoritos' });
      return false;
    } finally {
      set({ favoritesLoading: false });
    }
  },
  removeFromFavorites: async (productId) => {
    const { user, favorites } = get();
    if (!user) return false;

    try {
      set({ favoritesLoading: true, favoritesError: null });
      const userRef = doc(db, 'users', user.id);
      
      const productToRemove = favorites.find(p => p.id === productId);
      if (!productToRemove) return false;

      await updateDoc(userRef, {
        favorites: arrayRemove(productToRemove)
      });

      set(state => ({
        favorites: state.favorites.filter(p => p.id !== productId),
        favoritesError: null
      }));

      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      set({ favoritesError: 'Erro ao remover dos favoritos' });
      return false;
    } finally {
      set({ favoritesLoading: false });
    }
  },
  clearAllFavorites: async () => {
    const { user } = get();
    if (!user) return false;

    try {
      set({ favoritesLoading: true, favoritesError: null });
      const userRef = doc(db, 'users', user.id);
      
      // Update Firestore document to clear favorites array
      await updateDoc(userRef, {
        favorites: []
      });

      // Update local state
      set({ favorites: [], favoritesError: null });
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      set({ favoritesError: 'Erro ao limpar favoritos' });
      return false;
    } finally {
      set({ favoritesLoading: false });
    }
  },
  isFavorite: (affiliateLink) => {
    const { favorites } = get();
    return favorites.some(p => p.affiliateLink === affiliateLink);
  },
  loadFavorites: async () => {
    const { user } = get();
    if (!user) {
      set({ favorites: [] });
      return;
    }

    try {
      set({ favoritesLoading: true, favoritesError: null });
      const userRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Explicitly type the favorites array as Product[]
        const favorites = (userData.favorites || []) as Product[];
        // Garantir que não haja duplicatas usando affiliateLink como chave
        const uniqueFavorites = Array.from(
          new Map(
            favorites.map((product: Product) => [product.affiliateLink, product])
          ).values()
        );
        set({ favorites: uniqueFavorites });
      } else {
        await setDoc(userRef, { favorites: [] }, { merge: true });
        set({ favorites: [] });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      set({ favoritesError: 'Erro ao carregar favoritos' });
    } finally {
      set({ favoritesLoading: false });
    }
  }
}));

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};