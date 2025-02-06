import React, { useState, useRef } from 'react';
import { HandshakeIcon, Send, Check, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface FormData {
  name: string;
  phone: string;
  email: string;
  website: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export const PartnersPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    website: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^[0-9+\-() ]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !formRef.current) return;
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Initialize EmailJS with your public key
      emailjs.init("WskyFnuZ-xxad4YHf");

      // Send the email using EmailJS
      await emailjs.sendForm(
        'service_a46mpjd',
        'template_5c9kpqt',
        formRef.current,
        'WskyFnuZ-xxad4YHf'
      );

      setSubmitSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        website: ''
      });
      setTimeout(() => {
        setShowForm(false);
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitError('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-emerald-700 text-white py-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Parceria Sustentável"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-8">
            <HandshakeIcon className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Parceiros</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12">
            Seja nosso parceiro e amplie sua visibilidade no mercado de produtos sustentáveis.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-8 py-4 bg-white text-emerald-700 rounded-full text-lg font-semibold hover:bg-emerald-50 transition-colors duration-300 transform hover:scale-105"
          >
            Quero ser parceiro
            <HandshakeIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Visibilidade</h3>
            <p className="text-gray-600">
              Alcance consumidores conscientes e aumente a visibilidade dos seus produtos sustentáveis.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Networking</h3>
            <p className="text-gray-600">
              Conecte-se com outros parceiros e expanda sua rede de contatos no mercado sustentável.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Credibilidade</h3>
            <p className="text-gray-600">
              Fortaleça sua marca associando-a a uma plataforma comprometida com a sustentabilidade.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Cadastro de Parceiro</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Formulário enviado com sucesso!
                  </h3>
                  <p className="text-gray-600">
                    Entraremos em contato em breve.
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="user_name"
                      id="user_name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="user_phone"
                      id="user_phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="user_email"
                      id="user_email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="user_website" className="block text-sm font-medium text-gray-700 mb-1">
                      Site/URL
                    </label>
                    <input
                      type="url"
                      name="user_website"
                      id="user_website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  {submitError && (
                    <div className="flex items-center p-4 bg-red-50 rounded-md">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Enviar
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};