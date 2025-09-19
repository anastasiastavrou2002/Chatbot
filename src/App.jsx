import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormSteps from './FormSteps';
import SidebarPreview from './components/SidebarPreview';
import LoadingPage from './components/LoadingPage';

export default function App() {
  const { t } = useTranslation();

  // --- State ---
  const [formData, setFormData] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [leftWebsite, setLeftWebsite] = useState('');
  const [apiKey, setApiKey] = useState(null);
  const [widgetScript, setWidgetScript] = useState(null);

  // Νέες προσθήκες
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);

  // Mobile navigation state
  const [showMobileSteps, setShowMobileSteps] = useState(false);

  // --- State και λογική πλοήγησης φόρμας ---
  const [currentPage, setCurrentPage] = useState(0);
  const [maxVisitedPage, setMaxVisitedPage] = useState(0);

  const stepLabels = t('steps', { returnObjects: true }) || {};
  const steps = Object.values(stepLabels);

  const handleNext = () => {
    if (currentPage < steps.length - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (newPage > maxVisitedPage) setMaxVisitedPage(newPage);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleGoToPage = (pageIndex) => {
    if (pageIndex <= maxVisitedPage) {
      setCurrentPage(pageIndex);
      setShowMobileSteps(false); // Close mobile menu after selection
    }
  };

  const ACCENT_TITLE = 'indigo';
  const titleClass = {
    indigo: 'text-indigo-400',
    teal: 'text-teal-400',
    amber: 'text-amber-400',
    cyan: 'text-cyan-400',
  }[ACCENT_TITLE];

  // --- Υποβολή φόρμας (με server) ---
  const handleFormSubmit = async (finalData) => {
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
        const companyInfoStr = finalData.get('company_info');
        const companyData = JSON.parse(companyInfoStr);
        
        setFormData(prev => ({ ...prev, ...companyData }));
        setLeftWebsite(companyData.websiteURL || '');
        setLoading(false);
        setProgress(null);
        // Αυτόματη μετάβαση στο Test step
        setCurrentPage((prev) => prev + 1);
        
      }, 300);
    } catch (error) {
      if (interval) clearInterval(interval);
      setLoading(false);
      setProgress(null);
      console.error(error);
      alert('Κάτι πήγε στραβά. Δοκίμασε ξανά.');
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Mobile Header - Only visible on small screens */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className={`text-xl font-bold ${titleClass}`}>{t('appTitle')}</h1>
          
          {/* Mobile Steps Button - Only show when not submitted */}
          {!formSubmitted && !loading && (
            <button
              onClick={() => setShowMobileSteps(!showMobileSteps)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="text-sm font-medium">
                Step {currentPage + 1} of {steps.length}
              </span>
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
        
        {/* Mobile Steps Dropdown */}
        {showMobileSteps && !formSubmitted && !loading && (
          <div className="border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-2">
              <SidebarPreview
                steps={steps}
                currentPage={currentPage}
                maxVisitedPage={maxVisitedPage}
                onGoToPage={handleGoToPage}
                isMobile={true}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex min-h-screen lg:min-h-screen">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex bg-gray-100 pl-8 pr-4 py-8 flex-col relative overflow-hidden border-r border-gray-200 transition-all duration-500 lg:w-1/5">
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
                <p className="mt-4 text-gray-600 font-light tracking-wide">
                  {t('chatActiveSubtitle')}
                </p>
              </div>
              <div className="mt-10 flex items-center justify-center min-h-[280px]" />
              <div>
                <p className="text-sm text-gray-500">© 2025 Your Company</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="w-full flex items-start justify-start transition-all duration-500 lg:w-4/5 bg-zinc-50 min-h-screen lg:min-h-auto">
          <div className="w-full">
            {/* Content Container with proper padding */}
            <div className={`
              w-full max-w-none lg:max-w-4xl
              ${formSubmitted 
                ? 'p-4 sm:p-6 lg:p-8 lg:pl-8' 
                : 'p-4 sm:p-6 lg:p-8 lg:pl-8'
              }
              ${loading ? 'flex items-center justify-center min-h-screen lg:min-h-auto mx-auto' : ''}
            `}>
              {formSubmitted ? (
                <div className="w-full">
                  <ChatBubble chatbotData={formData} apiKey={apiKey} />
                </div>
              ) : loading ? (
                <div className="w-full max-w-2xl">
                  <LoadingPage 
                    title="Δημιουργούμε το chatbot σας"
                    subtitle="Επεξεργάζουμε τα δεδομένα και δημιουργούμε το AI μοντέλο..."
                    progress={progress}
                    tips={['Μην κλείσεις αυτή τη σελίδα', 'Θα σε ειδοποιήσουμε μόλις ολοκληρωθεί']}
                  />
                </div>
              ) : (
                <div className="w-full pt-4 lg:pt-0">
                  <FormSteps
                    currentPage={currentPage}
                    steps={steps}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onFormSubmit={handleFormSubmit}
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

      {/* Mobile overlay when steps menu is open */}
      {showMobileSteps && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileSteps(false)}
        />
      )}
    </div>
  );
}