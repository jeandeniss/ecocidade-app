"use client";

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success('Account created! Please check your email to verify.');
      } else {
        await signIn(email, password);
        toast.success('Welcome back!');
      }
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#2E8B57] text-white px-4 py-2 rounded-lg"
      >
        Sign In
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2E8B57] focus:ring focus:ring-[#2E8B57] focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2E8B57] focus:ring focus:ring-[#2E8B57] focus:ring-opacity-50"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2E8B57] text-white py-2 px-4 rounded-lg hover:bg-opacity-90"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="mt-4 text-sm text-[#2E8B57] hover:underline"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : 'Need an account? Sign up'}
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}