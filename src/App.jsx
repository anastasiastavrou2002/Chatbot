import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormSteps from './FormSteps';
import SidebarPreview from './components/SidebarPreview';

export default function App() {
  const { t } = useTranslation();

  // --- State ---
  const [formData, setFormData] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [leftWebsite, setLeftWebsite] = useState('');
  const [apiKey, setApiKey] = useState(null);

  // --- State και λογική πλοήγησης φόρμας ---
  const [currentPage, setCurrentPage] = useState(0);
  const [maxVisitedPage, setMaxVisitedPage] = useState(0);

  // Ο κώδικάς σου ήδη φορτώνει τα βήματα από το αρχείο locales! Τέλεια!
  const stepLabels = t('steps', { returnObjects: true }) || {};
  const steps = Object.values(stepLabels);

  const handleNext = () => { if (currentPage < steps.length - 1) { const newPage = currentPage + 1; setCurrentPage(newPage); if (newPage > maxVisitedPage) setMaxVisitedPage(newPage); } };
  const handlePrev = () => { if (currentPage > 0) setCurrentPage(currentPage - 1); };
  const handleGoToPage = (pageIndex) => { if (pageIndex <= maxVisitedPage) setCurrentPage(pageIndex); };

  const ACCENT_TITLE = 'indigo';
  const titleClass = { indigo: 'text-indigo-400', teal: 'text-teal-400', amber: 'text-amber-400', cyan: 'text-cyan-400', }[ACCENT_TITLE];

  const handleFormSubmit = (finalData) => {
    const companyInfoStr = finalData.get('company_info');
    const companyData = JSON.parse(companyInfoStr || '{}');
    setApiKey('demo_api_key_123');
    setFormData(companyData);
    setLeftWebsite(companyData.websiteURL || '');
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen font-sans">
      <div className="flex min-h-screen">
        {/* Sidebar */}
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
                {/* --- Τροποποίηση Εδώ --- */}
                <p className="text-sm text-gray-500">{t('copyright')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Main */}
        <div className="w-full flex items-center justify-start p-4 sm:p-8 lg:pl-12 transition-all duration-500 lg:w-4/5 bg-zinc-50">
          <div className="w-full max-w-3xl">
            {formSubmitted ? (
              <ChatBubble chatbotData={formData} apiKey={apiKey} />
            ) : (
              <FormSteps
                currentPage={currentPage}
                steps={steps}
                onNext={handleNext}
                onPrev={handlePrev}
                onFormSubmit={handleFormSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}