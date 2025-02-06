import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Leaf, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirmPasswordReset } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      navigate('/login');
    }
  }, [oobCode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await confirmPasswordReset(oobCode!, password);
      if (result.success) {
        setSuccess('Senha redefinida com sucesso! Você será redirecionado para o login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(result.error || 'Erro ao redefinir senha');
      }
    } catch (err) {
      setError('Ocorreu um erro ao redefinir a senha');
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
            Redefinir Senha
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Digite sua nova senha abaixo
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
            <p className="text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Nova Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};