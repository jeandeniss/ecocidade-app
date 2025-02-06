import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset ,
  applyActionCode,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useStore } from '../store/useStore';
import { User } from '../types';

export const useAuth = () => {
  const { setUser, setIsAuthenticated, loadFavorites } = useStore();
  const [loading, setLoading] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);
  const [lastVerificationTime, setLastVerificationTime] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          if (firebaseUser.emailVerified || firebaseUser.providerData.some(p => p?.providerId === 'google.com')) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            let userData: Omit<User, 'id'>;

            if (userDoc.exists()) {
              userData = userDoc.data() as Omit<User, 'id'>;
            } else {
              userData = {
                email: firebaseUser.email || '',
                username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
                isPremium: false
              };
              await setDoc(doc(db, 'users', firebaseUser.uid), {
                ...userData,
                favorites: [],
                emailVerified: true,
                createdAt: new Date().toISOString(),
                provider: 'google'
              });
            }
            
            const user = {
              id: firebaseUser.uid,
              ...userData
            };
            
            setUser(user);
            setIsAuthenticated(true);
            
            await loadFavorites();
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setIsAuthenticated, loadFavorites]);

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/login',
        handleCodeInApp: true
      });
      return { 
        success: true,
        message: 'Email de redefinição de senha enviado. Verifique sua caixa de entrada.'
      };
    } catch (error) {
      console.error('Error sending password reset:', error);
      const errorCode = (error as AuthError).code;
      
      switch (errorCode) {
        case 'auth/user-not-found':
          return {
            success: false,
            error: 'Não existe uma conta com este email.'
          };
        case 'auth/invalid-email':
          return {
            success: false,
            error: 'Email inválido.'
          };
        default:
          return {
            success: false,
            error: 'Erro ao enviar email de redefinição de senha.'
          };
      }
    }
  };

  const confirmPasswordReset = async (code: string, newPassword: string) => {
    try {
      await firebaseConfirmPasswordReset (auth, code, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Error confirming password reset:', error);
      const errorCode = (error as AuthError).code;
      
      switch (errorCode) {
        case 'auth/expired-action-code':
          return {
            success: false,
            error: 'O link de redefinição de senha expirou.'
          };
        case 'auth/invalid-action-code':
          return {
            success: false,
            error: 'O link de redefinição de senha é inválido.'
          };
        case 'auth/weak-password':
          return {
            success: false,
            error: 'A senha deve ter pelo menos 6 caracteres.'
          };
        default:
          return {
            success: false,
            error: 'Erro ao redefinir senha.'
          };
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential) {
        throw new Error('Failed to get credentials from Google Sign-In');
      }

      return { success: true };
    } catch (error) {
      console.error('Google Sign-In error:', error);
      const errorCode = (error as AuthError).code;
      
      switch (errorCode) {
        case 'auth/popup-closed-by-user':
          return {
            success: false,
            error: 'Login cancelado. Por favor, tente novamente.'
          };
        case 'auth/popup-blocked':
          return {
            success: false,
            error: 'Pop-up bloqueado pelo navegador. Por favor, permita pop-ups e tente novamente.'
          };
        case 'auth/account-exists-with-different-credential':
          return {
            success: false,
            error: 'Uma conta já existe com o mesmo email mas com método de login diferente.'
          };
        default:
          return {
            success: false,
            error: 'Erro ao fazer login com Google. Por favor, tente novamente.'
          };
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      if (!user.emailVerified) {
        await signOut(auth);
        return {
          success: false,
          error: 'Por favor, verifique seu email antes de fazer login. Verifique sua caixa de entrada.'
        };
      }

      return { success: true };
    } catch (error) {
      console.log('Firebase auth error:', (error as AuthError).code);
      
      switch ((error as AuthError).code) {
        case 'auth/user-not-found':
          return {
            success: false,
            error: 'A conta informada não existe. Por favor, verifique os dados ou crie uma nova conta.'
          };
        case 'auth/wrong-password':
          return {
            success: false,
            error: 'Senha incorreta. Por favor, tente novamente.'
          };
        case 'auth/invalid-email':
          return {
            success: false,
            error: 'Email inválido. Por favor, verifique o email informado.'
          };
        case 'auth/too-many-requests':
          return {
            success: false,
            error: 'Muitas tentativas de login. Por favor, tente novamente mais tarde.'
          };
        default:
          return { 
            success: false, 
            error: 'Falha na autenticação. Por favor, verifique suas credenciais.' 
          };
      }
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData: Omit<User, 'id'> = {
        email,
        username,
        isPremium: false
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        favorites: [],
        emailVerified: false,
        createdAt: new Date().toISOString()
      });

      // Send verification email
      await sendEmailVerification(user);
      setVerificationSent(true);
      setLastVerificationTime(Date.now());

      // Log verification attempt
      await updateDoc(doc(db, 'users', user.uid), {
        verificationAttempts: [{
          timestamp: new Date().toISOString(),
          success: true
        }]
      });

      // Sign out after registration to force email verification
      await signOut(auth);

      return { 
        success: true,
        message: 'Verifique sua caixa de entrada para o email de ativação, com link válido por 24 horas. Se não encontrar, confira também a caixa de spam ou lixo eletrônico.'
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      if ((error as AuthError).code === 'auth/email-already-in-use') {
        return {
          success: false,
          error: 'Este email já está em uso. Por favor, faça login ou use outro email.'
        };
      }

      return { 
        success: false, 
        error: 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.' 
      };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      // Check if enough time has passed since last verification email (5 minutes)
      if (lastVerificationTime && Date.now() - lastVerificationTime < 5 * 60 * 1000) {
        const remainingTime = Math.ceil((5 * 60 * 1000 - (Date.now() - lastVerificationTime)) / 1000);
        return {
          success: false,
          error: `Aguarde ${remainingTime} segundos antes de solicitar um novo email.`
        };
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        // Try to sign in temporarily to send verification email
        const { user } = await signInWithEmailAndPassword(auth, email, '');
        if (user) {
          await sendEmailVerification(user);
          await signOut(auth);
        }
      } else {
        await sendEmailVerification(currentUser);
      }

      setVerificationSent(true);
      setLastVerificationTime(Date.now());

      return {
        success: true,
        message: 'Email de verificação reenviado. Por favor, verifique sua caixa de entrada.'
      };
    } catch (error) {
      console.error('Error resending verification:', error);
      return {
        success: false,
        error: 'Erro ao reenviar email de verificação. Por favor, tente novamente.'
      };
    }
  };

  const verifyEmail = async (actionCode: string) => {
    try {
      await applyActionCode(auth, actionCode);
      
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          emailVerified: true,
          verifiedAt: new Date().toISOString()
        });
      }

      return {
        success: true,
        message: 'Email verificado com sucesso! Você já pode fazer login.'
      };
    } catch (error) {
      console.error('Error verifying email:', error);
      return {
        success: false,
        error: 'Erro ao verificar email. O link pode ter expirado ou ser inválido.'
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'Ocorreu um erro ao fazer logout. Por favor, tente novamente.' 
      };
    }
  };

  return { 
    login, 
    register, 
    logout, 
    loading,
    verificationSent,
    resendVerificationEmail,
    verifyEmail,
    signInWithGoogle,
    resetPassword,
    confirmPasswordReset
  };
};