import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/utils/ScrollToTop';
import HomePage from './pages/HomePage';
import { SearchComparePage } from './pages/SearchComparePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { CartPage } from './pages/CartPage';
import { AdminPage } from './pages/AdminPage';
import { SustainableFoodPage } from './pages/SustainableFoodPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { PartnersPage } from './pages/PartnersPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Routes>
          <Route
            path="/admin/*"
            element={<AdminPage />}
          />
          <Route
            path="*"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchComparePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/sustainable-food" element={<SustainableFoodPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/partners" element={<PartnersPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;