import React, { useState } from 'react';
import { Globe, User2, Mail, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CreateAccountModal({ onSuccess, onCancel }) {
  const { t, i18n } = useTranslation();

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [otp,       setOtp]       = useState('');

  const [otpSent, setOtpSent]           = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState('');

  const toggleLang = () => {
    const next = i18n.language === 'el' ? 'en' : 'el';
    i18n.changeLanguage(next);
  };

  const sendOtp = () => {
    setError('');
    if (!email || !email.includes('@')) {
      setError(t('login.validEmail', 'Παρακαλώ δώσε έγκυρο email.'));
      return;
    }
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
    }, 800);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');

    if (!firstName) return setError(t('signup.fullNameRequired', 'Συμπλήρωσε όνομα.'));
    if (!lastName)  return setError(t('signup.lastNameRequired', 'Συμπλήρωσε επίθετο.'));
    if (!email || !email.includes('@')) return setError(t('signup.emailInvalid', 'Μη έγκυρο email.'));
    if (!otpSent)  return setError(t('login.sendOtp', 'Στείλε κωδικό OTP.'));
    if (!otp || otp.length !== 6) return setError(t('login.enterOtp', 'Συμπλήρωσε 6-ψήφιο OTP.'));

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess?.({ firstName, lastName, email });
    }, 700);
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
          <h1 className="text-2xl font-bold text-white text-center">
            {t('createAccount.title', 'Δημιουργία λογαριασμού')}
          </h1>
          <p className="text-indigo-100 text-center mt-2">
            {t('createAccount.subtitle', 'Συμπλήρωσε τα στοιχεία σου για να συνεχίσεις')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('signup.firstName', 'Όνομα')}
            </label>
            <div className="relative">
              <User2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder={t('signup.firstNamePlaceholder', 'π.χ. Γιάννης')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('signup.lastName', 'Επίθετο')}
            </label>
            <div className="relative">
              <User2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder={t('signup.lastNamePlaceholder', 'π.χ. Παπαδόπουλος')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('signup.email', 'Email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="example@email.com"
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={isSendingOtp}
                className="absolute right-1 top-1 bottom-1 px-3 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSendingOtp ? t('login.sending', 'Αποστολή…') : (otpSent ? t('login.resendOtp', 'Επαναποστολή') : t('login.sendOtp', 'Αποστολή OTP'))}
              </button>
            </div>
            {otpSent && (
              <p className="text-xs text-gray-500 mt-1">
                {t('login.otpSentTo', 'Στάλθηκε κωδικός στο')} {email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.otpCode', 'Κωδικός OTP')}
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center text-lg tracking-widest font-mono"
                placeholder="123456"
                maxLength={6}
                disabled={!otpSent}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-800 rounded-lg py-3 hover:bg-gray-50"
            >
              {t('cancel', 'Άκυρο')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-60"
            >
              {isLoading ? t('submitting', 'Γίνεται…') : t('createAccount.cta', 'Δημιουργία λογαριασμού')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
