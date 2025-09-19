// src/FormSteps.jsx

import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import BasicInfo from './components/BasicInfo.jsx';
import UploadFiles from './components/UploadFiles.jsx';
import Settings from './components/Settings.jsx';
import Design from './components/Design.jsx';
import Capabilities from './components/Capabilities.jsx';
import Test from './components/Test.jsx';
import Analytics from './components/Analytics.jsx';
import Deploy from './components/Deploy.jsx';

import GreekFlag from './assets/greekflag.jpg';
import UkFlag from './assets/ukflag.jpg';

export default function FormSteps({
  currentPage,
  steps,
  onNext,
  onPrev,
  onFormSubmit,
  apiKey,
  widgetScript,
  inheritedFormData,
  initialData = {},
}) {
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    botName: '',
    greeting: '',
    persona: '',
    botRestrictions: '',
    companyName: '',
    websiteURL: '',
    industry: '',
    industryOther: '',
    description: '',
    keywords: '',
    allowedDomains: '',
    primaryColor: '#4f46e5',
    position: 'Bottom Right',
    themeStyle: 'Minimal',
    suggestedPrompts: '',
    ...initialData,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadFilesRef = useRef(null);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }, [errors]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const files = uploadFilesRef.current ? uploadFilesRef.current.getFiles() : [];
      const formDataToSend = new FormData();
      formDataToSend.append('company_info', JSON.stringify(formData));
      files.forEach((file) => formDataToSend.append('files', file));
      await onFormSubmit(formDataToSend);
    } finally {
      setTimeout(() => setIsSubmitting(false), 400);
    }
  };

  const commonProps = { formData, handleInputChange, errors };
  const progress = steps.length > 0 ? ((currentPage + 1) / steps.length) * 100 : 0;
  const changeLang = (lng) => i18n.changeLanguage(lng);

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-end gap-3 mb-4">
          <img
            src={UkFlag}
            alt={t('formSteps.altEnglish', 'English')}
            className={`w-7 h-5 cursor-pointer rounded shadow ${i18n.language === 'en' ? 'ring-2 ring-indigo-500' : ''}`}
            onClick={() => changeLang('en')}
          />
          <img
            src={GreekFlag}
            alt={t('formSteps.altGreek', 'Ελληνικά')}
            className={`w-7 h-5 cursor-pointer rounded shadow ${i18n.language === 'el' ? 'ring-2 ring-indigo-500' : ''}`}
            onClick={() => changeLang('el')}
          />
        </div>

        <p className="text-sm font-medium text-indigo-600">{steps[currentPage]}</p>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label={t('progress')}>
          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="min-h-[450px]">
          {currentPage === 0 && <BasicInfo {...commonProps} />}
          {currentPage === 1 && <UploadFiles {...commonProps} ref={uploadFilesRef} />}
          {currentPage === 2 && <Settings {...commonProps} />}
          {currentPage === 3 && <Capabilities {...commonProps} />}
          {currentPage === 4 && <Design {...commonProps} />}
          {currentPage === 5 && (
            <Test
              formData={inheritedFormData || formData}
              apiKey={apiKey}
              serverUrl="http://127.0.0.1:8000/chat"
            />
          )}
          {currentPage === 6 && <Analytics {...commonProps} />}
          {currentPage === 7 && <Deploy {...commonProps} apiKey={apiKey} widgetScript={widgetScript} />}
        </div>

        <div className={`flex pt-6 ${currentPage > 0 ? 'justify-between' : 'justify-end'}`}>
          {currentPage > 0 && (
            <button type="button" onClick={onPrev} className="text-slate-600 font-medium py-3 px-6 rounded-lg bg-slate-100">
              {t('back')}
            </button>
          )}

          {currentPage < steps.length - 1 && (
            <button
              type="button"
              onClick={currentPage === 4 ? handleSubmit : onNext}
              className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg"
              disabled={currentPage === 4 && isSubmitting}
            >
              {currentPage === 4 ? (isSubmitting ? t('submitting') : t('createChatbot', 'Create Chatbot')) : t('next')}
            </button>
          )}

          {currentPage === steps.length - 1 && (
            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed">
              {isSubmitting ? t('submitting') : t('submit')}
            </button>
          )}
        </div>
      </form>
    </>
  );
}
