import React, { useState } from 'react';
import { Mail, Shield, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Full-page OTP login (email + 6-digit code)
 * Props:
 * - onSubmit: function() -> καλείται όταν γίνει επιτυχής σύνδεση
 * - onResend: optional function() -> καλείται όταν γίνεται resend OTP
 */
export default function OtpPage({ onSubmit, onResend }) {
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'el' ? 'en' : 'el');
  };

  const handleSendOtp = () => {
    setError('');
    if (!email) {
      return setError(t('login.enterEmail', 'Παρακαλώ εισάγετε email.'));
    }
    if (!email.includes('@')) {
      return setError(t('login.validEmail', 'Εισάγετε έγκυρο email.'));
    }
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
      onResend && onResend();
    }, 700);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');

    if (!otpSent) {
      handleSendOtp();
      return;
    }
    if (!otp || otp.length !== 6) {
      return setError(t('login.enterOtp', 'Συμπλήρωσε 6-ψήφιο OTP.'));
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (typeof onSubmit === 'function') onSubmit();
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 relative">
          <button
            onClick={toggleLang}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 flex items-center gap-1 text-sm"
          >
            <Globe className="h-4 w-4" />
            {i18n.language === 'el' ? 'EN' : 'EL'}
          </button>
          <h1 className="text-2xl font-bold text-white text-center">
            {t('login.title', 'Σύνδεση')}
          </h1>
          <p className="text-indigo-100 text-center mt-2">
            {otpSent
              ? t('login.enterCode', 'Εισάγετε τον κωδικό που λάβατε')
              : t('login.welcomeBack', 'Καλώς ήρθες!')}
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 bg-transparent space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.email', 'Email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none ${
                  otpSent ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* OTP */}
          {otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.otpCode', 'Κωδικός OTP')}
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-center text-lg tracking-widest font-mono"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t('login.otpSentTo', 'Στάλθηκε κωδικός στο')} {email}
              </p>
            </div>
          )}

          {/* Errors */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center justify-between">
            {otpSent ? (
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setError('');
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {t('login.changeEmail', 'Αλλαγή email')}
              </button>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
            >
              {isSendingOtp
                ? t('login.sending', 'Αποστολή…')
                : otpSent
                ? t('login.resendOtp', 'Επαναποστολή OTP')
                : t('login.sendOtp', 'Αποστολή OTP')}
            </button>
          </div>

          {/* Main CTA */}
          <button
            type="submit"
            disabled={isLoading || isSendingOtp}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
          >
            {isLoading
              ? t('login.loggingIn', 'Γίνεται σύνδεση…')
              : otpSent
              ? t('login.login', 'Σύνδεση')
              : t('login.sendOtp', 'Αποστολή OTP')}
          </button>
        </form>
      </div>
    </div>
  );
}
