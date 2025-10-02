// src/App.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ConsentProvider } from './components/CookieConsent';
import FormSteps from './FormSteps';
import SidebarPreview from './components/SidebarPreview';
import LoadingPage from './components/LoadingPage';

import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import OtpPage from './components/OtpPage';
import CreateAccountModal from './components/CreateAccountModal';

export default function App() {
  const { t } = useTranslation();

  const [view, setView] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const [formData, setFormData] = useState({});
  const [apiKey, setApiKey] = useState(null);
  const [widgetScript, setWidgetScript] = useState(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [maxVisitedPage, setMaxVisitedPage] = useState(0);
  const [showMobileSteps, setShowMobileSteps] = useState(false);

  const stepLabels = t('steps', { returnObjects: true }) || {};
  const steps = Object.values(stepLabels);

  const ACCENT_TITLE = 'indigo';
  const titleClass = {
    indigo: 'text-indigo-400',
    teal: 'text-teal-400',
    amber: 'text-amber-400',
    cyan: 'text-cyan-400',
  }[ACCENT_TITLE];

  const handleNext = () => {
    if (currentPage < steps.length - 1) {
      const p = currentPage + 1;
      setCurrentPage(p);
      if (p > maxVisitedPage) setMaxVisitedPage(p);
    }
  };
  const handlePrev = () => currentPage > 0 && setCurrentPage(currentPage - 1);
  const handleGoToPage = (i) => i <= maxVisitedPage && (setCurrentPage(i), setShowMobileSteps(false));

  const performRealSubmit = async (finalData) => {
    let interval = null;
    try {
      setLoading(true);
      setProgress(8);
      interval = setInterval(() => {
        setProgress((p) => (p === null ? 8 : Math.min(p + Math.random() * 8, 92)));
      }, 700);

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
        const infoStr = finalData.get('company_info');
        const companyData = JSON.parse(infoStr || '{}');
        setFormData((prev) => ({ ...prev, ...companyData }));
        setLoading(false);
        setProgress(null);
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

  const handleRequestCreateBot = async (finalData) => {
    setPendingFormData(finalData);
    setShowCreateAccount(true);
    return Promise.resolve();
  };

  const handleCreateAccountSuccess = async () => {
    setShowCreateAccount(false);
    if (pendingFormData) {
      const toSend = pendingFormData;
      setPendingFormData(null);
      await performRealSubmit(toSend);
    }
  };

  const goToWizard = () => {
    setView('wizard');
    window.scrollTo(0, 0);
  };
  const openLoginPage = () => setView('login');

  const handleLoginOtpSuccess = () => {
    setIsAuthenticated(true);
    setView('dashboard');
  };

  const handleEditAgent = (agent, targetStep = 0) => {
    setFormData((prev) => ({
      ...prev,
      agentId: agent.id,
      agentName: agent.name,
    }));
    setCurrentPage(targetStep);
    setMaxVisitedPage((prev) => Math.max(prev, targetStep));
    setView('wizard');
    window.scrollTo(0, 0);
  };

  const mobileStepLabel = t('formSteps.stepShortOfTotal', {
    defaultValue: 'Βήμα {{current}} από {{total}}',
    current: currentPage + 1,
    total: steps.length,
  });

  return (
    <ConsentProvider onlyNecessary>
      {view === 'landing' && (
        <div className="min-h-screen">
          <LandingPage onStart={goToWizard} onSignIn={openLoginPage} />
        </div>
      )}

      {view === 'login' && (
        <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 flex items-center justify-center p-4 relative">
          <button
            onClick={() => setView('landing')}
            className="absolute top-4 left-4 text-sm text-gray-700 hover:text-gray-900"
          >
            {t('back', 'Πίσω')}
          </button>
          <OtpPage onSubmit={handleLoginOtpSuccess} onResend={() => {}} />
        </div>
      )}

      {view === 'dashboard' && (
        <div className="min-h-screen bg-zinc-50">
          <div className="p-4">
            <button
              onClick={() => setView('wizard')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {t('backToBuilder', 'Επιστροφή στον Builder')}
            </button>
          </div>
          <Dashboard onEditAgent={(agent) => handleEditAgent(agent, 0)} />
        </div>
      )}

      {view === 'wizard' && (
        <div className="min-h-screen font-sans relative">
          <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-4 py-3 flex items-center justify-between">
              <h1 className={`text-xl font-bold ${titleClass}`}>{t('appTitle')}</h1>
              {!loading && (
                <button
                  onClick={() => setShowMobileSteps((s) => !s)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                  aria-expanded={showMobileSteps}
                  aria-controls="mobile-steps"
                >
                  <span className="text-sm font-medium">{mobileStepLabel}</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${showMobileSteps ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            {showMobileSteps && !loading && (
              <div id="mobile-steps" className="border-t border-gray-200 bg-white shadow-lg">
                <div className="px-4 py-2">
                  <SidebarPreview
                    steps={steps}
                    currentPage={currentPage}
                    maxVisitedPage={maxVisitedPage}
                    onGoToPage={handleGoToPage}
                    isMobile
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex min-h-screen lg:min-h-screen">
            <div className="hidden lg:flex bg-gray-100 pl-6 pr-4 py-8 flex-col border-r border-gray-200 lg:w-72 flex-none">
              <SidebarPreview
                steps={steps}
                currentPage={currentPage}
                maxVisitedPage={maxVisitedPage}
                onGoToPage={handleGoToPage}
              />
            </div>

            <div className="w-full lg:flex-1 bg-zinc-50 min-h-screen lg:min-h-auto">
              <div className={`w-full ${loading ? 'flex items-center justify-center min-h-screen lg:min-h-auto' : ''}`}>
                <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                  <div className="max-w-3xl xl:max-w-4xl">
                    {loading ? (
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
                          onFormSubmit={handleRequestCreateBot}
                          apiKey={apiKey}
                          widgetScript={widgetScript}
                          inheritedFormData={formData}
                        />
                        <div className="mt-8">
                          <button
                            onClick={() => setView('landing')}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            {t('back', 'Πίσω στη Landing')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showCreateAccount && (
            <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-0 relative">
                <button
                  onClick={() => setShowCreateAccount(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  ✕
                </button>
                <CreateAccountModal
                  onSuccess={handleCreateAccountSuccess}
                  onCancel={() => setShowCreateAccount(false)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </ConsentProvider>
  );
}
