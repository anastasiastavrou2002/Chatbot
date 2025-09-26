// src/App.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormSteps from './FormSteps';
import SidebarPreview from './components/SidebarPreview';
import LoadingPage from './components/LoadingPage';
import OtpPage from './components/OtpPage';             // για Login
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import CreateAccountModal from './components/CreateAccountModal'; // NEW

export default function App() {
  const { t } = useTranslation();

  // Landing first
  const [showLanding, setShowLanding] = useState(true);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Overlays: 'loginOtp' | 'createAccount' | null
  const [overlay, setOverlay] = useState(null);

  // Create-flow pending data (από το βήμα 5/Design μέχρι να περάσει account+otp)
  const [pendingFormData, setPendingFormData] = useState(null);

  // App data
  const [formData, setFormData] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false); // true => Dashboard (μόνο μετά από Login)
  const [apiKey, setApiKey] = useState(null);
  const [widgetScript, setWidgetScript] = useState(null);

  // Loading/progress
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);

  // Wizard navigation
  const [currentPage, setCurrentPage] = useState(0);
  const [maxVisitedPage, setMaxVisitedPage] = useState(0);
  const [showMobileSteps, setShowMobileSteps] = useState(false);
  const stepLabels = t('steps', { returnObjects: true }) || {};
  const steps = Object.values(stepLabels);

  const handleNext = () => {
    if (currentPage < steps.length - 1) {
      const p = currentPage + 1;
      setCurrentPage(p);
      if (p > maxVisitedPage) setMaxVisitedPage(p);
    }
  };
  const handlePrev = () => currentPage > 0 && setCurrentPage(currentPage - 1);
  const handleGoToPage = (i) => i <= maxVisitedPage && (setCurrentPage(i), setShowMobileSteps(false));

  const ACCENT_TITLE = 'indigo';
  const titleClass = { indigo: 'text-indigo-400', teal: 'text-teal-400', amber: 'text-amber-400', cyan: 'text-cyan-400' }[ACCENT_TITLE];

  // ----- Backend submit (μετά από επιτυχή Create Account + OTP) -----
  const performRealSubmit = async (finalData) => {
    let interval = null;
    try {
      setLoading(true);
      setProgress(8);
      interval = setInterval(() => setProgress((p) => (p === null ? 8 : Math.min(p + Math.random() * 8, 92))), 700);

      const res = await fetch('http://127.0.0.1:8000/create_chatbot', {
        method: 'POST',
        body: finalData,
      });
      if (!res.ok) throw new Error('create_chatbot failed');

      const responseData = await res.json();
      setApiKey(responseData.api_key);
      setWidgetScript(responseData.widget_script);

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        const companyInfoStr = finalData.get('company_info');
        const companyData = JSON.parse(companyInfoStr || '{}');
        setFormData((prev) => ({ ...prev, ...companyData }));
        setLoading(false);
        setProgress(null);
        // προχώρα στα επόμενα βήματα (π.χ. Test/Deploy)
        setCurrentPage((prev) => Math.min(prev + 1, steps.length - 1));
        setMaxVisitedPage((prev) => Math.max(prev, currentPage + 1));
      }, 300);
    } catch (e) {
      if (interval) clearInterval(interval);
      setLoading(false);
      setProgress(null);
      console.error(e);
      alert('Κάτι πήγε στραβά. Δοκίμασε ξανά.');
    }
  };

  // ----- Start Free → στο βήμα 5 (Design) πατάς Create → άνοιγμα Create Account modal -----
  const handleRequestCreateBot = async (finalData) => {
    setPendingFormData(finalData);
    setOverlay('createAccount');
    return Promise.resolve();
  };

  // ----- Landing buttons -----
  const goToWizard = () => { setShowLanding(false); window.scrollTo(0, 0); };
  const openLogin = () => setOverlay('loginOtp');

  // ----- Login OTP success → Dashboard -----
  const handleLoginOtpSuccess = () => {
    setOverlay(null);
    setIsAuthenticated(true);
    setFormSubmitted(true);  // δείξε Dashboard
    setShowLanding(false);   // φύγε από Landing
  };

  // ----- CreateAccount success (πέρασε OTP) → κάνε submit τα δεδομένα του wizard -----
  const handleCreateAccountSuccess = async (profile) => {
    setOverlay(null);
    // προαιρετικά: setIsAuthenticated(true);
    if (pendingFormData) {
      const toSend = pendingFormData;
      setPendingFormData(null);
      await performRealSubmit(toSend);
    }
  };

  // ----- UI helpers -----
  const mobileStepLabel = t('formSteps.stepShortOfTotal', {
    defaultValue: 'Βήμα {{current}} από {{total}}',
    current: currentPage + 1,
    total: steps.length,
  });

  return (
    <div className="min-h-screen font-sans relative">
      {/* -------- Landing FIRST -------- */}
      {showLanding ? (
        <>
          <LandingPage onStart={goToWizard} onSignIn={openLogin} />

          {/* LOGIN (email + OTP) */}
          {overlay === 'loginOtp' && (
            <div className="fixed inset-0 z-[1200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-0 relative">
                <button onClick={() => setOverlay(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Close">✕</button>
                <OtpPage
                  contactLabel=""
                  onSubmit={handleLoginOtpSuccess}
                  onResend={() => {}}
                  initialSeconds={30}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Mobile Header (χωρίς κουμπί login εδώ) */}
          <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-4 py-3 flex items-center justify-between">
              <h1 className={`text-xl font-bold ${titleClass}`}>{t('appTitle')}</h1>

              {!formSubmitted && !loading && (
                <button
                  onClick={() => setShowMobileSteps((s) => !s)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                  aria-expanded={showMobileSteps}
                  aria-controls="mobile-steps"
                >
                  <span className="text-sm font-medium">{mobileStepLabel}</span>
                  <svg className={`w-4 h-4 transform transition-transform ${showMobileSteps ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex min-h-screen lg:min-h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex bg-gray-100 pl-6 pr-4 py-8 flex-col border-r border-gray-200 lg:w-72 flex-none">
              {!formSubmitted ? (
                <SidebarPreview
                  steps={steps}
                  currentPage={currentPage}
                  maxVisitedPage={maxVisitedPage}
                  onGoToPage={handleGoToPage}
                />
              ) : (
                <div className="z-10 flex flex-col justify-between h-full">
                  <div>
                    <h1 className={`text-3xl font-bold ${titleClass}`}>{t('appTitle')}</h1>
                    <p className="mt-4 text-gray-600 font-light tracking-wide">{t('chatActiveSubtitle')}</p>
                    <button onClick={() => setFormSubmitted(false)} className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium">
                      {t('backToBuilder', 'Επιστροφή στον Builder')}
                    </button>
                  </div>
                  <div className="mt-10 flex items-center justify-center min-h-[280px]" />
                  <div><p className="text-sm text-gray-500">{t('copyright')}</p></div>
                </div>
              )}
            </div>

            {/* Main area */}
            <div className="w-full lg:flex-1 bg-zinc-50 min-h-screen lg:min-h-auto">
              <div className={`w-full ${loading ? 'flex items-center justify-center min-h-screen lg:min-h-auto' : ''}`}>
                <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                  <div className="max-w-3xl xl:max-w-4xl">
                    {formSubmitted ? (
                      <Dashboard />
                    ) : loading ? (
                      <div className="w-full max-w-2xl">
                        <LoadingPage
                          title={t('creatingChatbotTitle')}
                          subtitle={t('creatingChatbotSubtitle')}
                          progress={progress}
                          tips={[t('dontClosePage'), t('willNotifyWhenReady')]}
                        />
                      </div>
                    ) : (
                      <div className="w-full pt-4 lg:pt-0">
                        <FormSteps
                          currentPage={currentPage}
                          steps={steps}
                          onNext={handleNext}
                          onPrev={handlePrev}
                          onFormSubmit={handleRequestCreateBot} // στο βήμα 5 ανοίγει CreateAccount
                          apiKey={apiKey}
                          widgetScript={widgetScript}
                          inheritedFormData={formData}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CREATE ACCOUNT modal (Design step) */}
          {overlay === 'createAccount' && (
            <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-0 relative">
                <button onClick={() => setOverlay(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Close">✕</button>
                <CreateAccountModal
                  onSuccess={handleCreateAccountSuccess}
                  onCancel={() => setOverlay(null)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
