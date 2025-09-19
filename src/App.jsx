import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormSteps from './FormSteps';
import SidebarPreview from './components/SidebarPreview';


export default function App() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [leftWebsite, setLeftWebsite] = useState('');
  const [apiKey, setApiKey] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [maxVisitedPage, setMaxVisitedPage] = useState(0);

  const stepLabels = t('steps', { returnObjects: true }) || {};
  const steps = useMemo(() => Object.values(stepLabels), [stepLabels]);

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
    if (pageIndex <= maxVisitedPage) setCurrentPage(pageIndex);
  };

  const ACCENT_TITLE = 'indigo';
  const titleClass = {
    indigo: 'text-indigo-400',
    teal: 'text-teal-400',
    amber: 'text-amber-400',
    cyan: 'text-cyan-400',
  }[ACCENT_TITLE];

  const handleFormSubmit = (finalData) => {
    const companyInfoStr = finalData.get('company_info');
    const companyData = JSON.parse(companyInfoStr || '{}');
    setApiKey('demo_api_key_123');
    setFormData(companyData);
    setLeftWebsite(companyData.websiteURL || '');
    setFormSubmitted(true);
  };

  const progress =
    steps.length > 1 ? (maxVisitedPage / (steps.length - 1)) * 100 : 0;

  return (
    <div className="min-h-screen font-sans bg-zinc-50">
      {/* Mobile header / stepper */}
      {!formSubmitted && (
        <div className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200 px-4 pt-[env(safe-area-inset-top)]">
          <div className="py-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {t('appTitle')}
            </h1>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 -mx-1 overflow-x-auto">
              <div className="flex gap-2 px-1">
                {steps.map((label, idx) => {
                  const isEnabled = idx <= maxVisitedPage;
                  const isActive = idx === currentPage;
                  return (
                    <button
                      key={idx}
                      onClick={() => isEnabled && handleGoToPage(idx)}
                      className={[
                        'whitespace-nowrap rounded-full px-3 py-1 text-xs border',
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : isEnabled
                          ? 'bg-white text-slate-700 border-slate-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200',
                      ].join(' ')}
                      disabled={!isEnabled}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="lg:grid lg:min-h-screen lg:grid-cols-5">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex col-span-1 bg-gray-50 pl-8 pr-4 py-8 flex-col relative overflow-hidden border-r border-gray-200">
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
                <h1 className={`text-3xl font-bold ${titleClass}`}>
                  {t('appTitle')}
                </h1>
                <p className="mt-4 text-gray-600 font-light tracking-wide">
                  {t('chatActiveSubtitle')}
                </p>
              </div>
              <div className="mt-10 flex items-center justify-center min-h-[280px]" />
              <div>
                <p className="text-sm text-gray-500">{t('copyright')}</p>
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="col-span-4 w-full flex items-start justify-start p-4 sm:p-6 lg:pl-12">
          <div className="w-full max-w-3xl mx-auto">
            {formSubmitted ? (
              <ChatBubble chatbotData={formData} apiKey={apiKey} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6">
                <FormSteps
                  currentPage={currentPage}
                  steps={steps}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onFormSubmit={handleFormSubmit}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile bottom bar when form active */}
      {!formSubmitted && (
        <div className="lg:hidden h-4" />
      )}
    </div>
  );
}
