import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Leaf, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, resendVerificationEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const result = await register(email, password, username);
      if (result.success) {
        setSuccess(result.message ?? 'Conta criada com sucesso! Verifique seu email.');
        setEmail('');
        setPassword('');
        setUsername('');
      } else {
        setError(result.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar criar sua conta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Erro ao fazer login com Google');
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar fazer login com Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Por favor, informe seu email');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await resendVerificationEmail(email);
      if (result.success) {
        setSuccess(result.message ?? 'Email de verificação reenviado com sucesso.');
      } else {
        setError(result.error ?? 'Erro ao reenviar email de verificação');
      }
    } catch (err) {
      setError('Erro ao reenviar email de verificação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Leaf className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Junte-se a nós na busca por um consumo mais sustentável
          </p>
        </div>
        
        {error && (
          <div className="flex items-center bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
            <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm">{success}</p>
              <button
                type="button"
                onClick={handleResendVerification}
                className="text-sm font-medium text-green-700 hover:text-green-800 mt-1"
              >
                Reenviar email de verificação
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nome de usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Ou continue com</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5 mr-2"
              />
              Google
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Já tem uma conta? Faça login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};