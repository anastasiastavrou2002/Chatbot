// src/components/SignUpPage.jsx
import React, { useState } from 'react';
import { Mail, Shield, Globe, User, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SignUpPage({ onSubmit }) {
  const { t, i18n } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // --- Έλεγχοι Εγκυρότητας ---
    if (!fullName || !email || !password || !confirmPassword) {
      return setError(t('signup.fillAllFields')); // π.χ., "Παρακαλώ συμπληρώστε όλα τα πεδία."
    }
    if (!email.includes('@')) {
      return setError(t('signup.validEmail')); // π.χ., "Εισαγάγετε ένα έγκυρο email."
    }
    if (password.length < 6) {
      return setError(t('signup.passwordTooShort')); // π.χ., "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες."
    }
    if (password !== confirmPassword) {
      return setError(t('signup.passwordsDontMatch')); // π.χ., "Οι κωδικοί πρόσβασης δεν ταιριάζουν."
    }
    // --- Τέλος Ελέγχων ---

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // 👇 Εδώ θα καλούσατε τη συνάρτηση για την εγγραφή
      if (typeof onSubmit === 'function') {
        onSubmit({ fullName, email, password });
      }
    }, 800);
  };

  const toggleLang = () => {
    const next = i18n.language === 'el' ? 'en' : 'el';
    i18n.changeLanguage(next);
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl overflow-hidden bg-transparent shadow-none border-0">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 relative rounded-t-2xl">
          <button
            onClick={toggleLang}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 flex items-center gap-1 text-sm"
          >
            <Globe className="h-4 w-4" />
            {i18n.language === 'el' ? 'EN' : 'EL'}
          </button>
          <h1 className="text-2xl font-bold text-white text-center">{t('signup.title')}</h1>
          <p className="text-indigo-100 text-center mt-2">
            {t('signup.subtitle')}
          </p>
        </div>

        <div className="p-8 bg-transparent">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('signup.fullName')}</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder={t('signup.fullNamePlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('signup.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('signup.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="********"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('signup.confirmPassword')}</label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="********"
                />
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('signup.creatingAccount')}
                </div>
              ) : (
                t('signup.createAccount')
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {t('signup.alreadyAccount')}{' '}
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                {t('signup.login')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}