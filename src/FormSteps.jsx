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
  initialData = {},
}) {
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({ ...initialData });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadFilesRef = useRef(null);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    },
    [errors]
  );

  // (παραμένουν ίδια)
  const ensureHttp = (url) => { if (!url) return ''; if (!/^https?:\/\//i.test(url)) return 'http://' + url; return url; };
  const validatePage = (pageIndex) => { return {}; };
  const handleSubmit = async (e) => { e.preventDefault(); setIsSubmitting(true); const fd = new FormData(); onFormSubmit(fd); setTimeout(() => setIsSubmitting(false), 1000); };

  const commonProps = { formData, handleInputChange, errors };
  const progress = steps.length > 0 ? ((currentPage + 1) / steps.length) * 100 : 0;
  const changeLang = (lng) => i18n.changeLanguage(lng);

  return (
    <>
      {/* Header + Progress */}
      <div className="mb-5 sm:mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm font-medium text-indigo-600 truncate">
            {steps[currentPage]}
          </p>
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={UkFlag}
              alt={t('formSteps.altEnglish')}
              className={`h-4 w-6 sm:h-5 sm:w-7 cursor-pointer rounded shadow ${
                i18n.language === 'en' ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => changeLang('en')}
            />
            <img
              src={GreekFlag}
              alt={t('formSteps.altGreek')}
              className={`h-4 w-6 sm:h-5 sm:w-7 cursor-pointer rounded shadow ${
                i18n.language === 'el' ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => changeLang('el')}
            />
          </div>
        </div>

        <div
          className="w-full overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label={t('progress')}
        >
          <div
            className="h-1.5 sm:h-2 rounded-full bg-indigo-600 transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="min-h-[380px] sm:min-h-[450px]">
          {currentPage === 0 && <BasicInfo {...commonProps} />}
          {currentPage === 1 && <UploadFiles {...commonProps} ref={uploadFilesRef} />}
          {currentPage === 2 && <Settings {...commonProps} />}
          {currentPage === 3 && <Capabilities {...commonProps} />}
          {currentPage === 4 && <Design {...commonProps} />}
          {currentPage === 5 && <Test {...commonProps} />}
          {currentPage === 6 && <Deploy {...commonProps} />}
          {currentPage === 7 && <Analytics {...commonProps} />}
        </div>

        {/* Actions */}
        <div
          className={`flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-5 sm:pt-6 ${
            currentPage > 0 ? 'sm:justify-between' : 'sm:justify-end'
          }`}
        >
          {currentPage > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="w-full sm:w-auto rounded-lg bg-slate-100 px-4 sm:px-6 py-2.5 text-sm sm:text-base font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {t('back')}
            </button>
          )}

          {currentPage < steps.length - 1 && (
            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 sm:px-6 py-2.5 text-sm sm:text-base font-semibold text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {t('next')}
            </button>
          )}

          {currentPage === steps.length - 1 && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 px-4 sm:px-6 py-2.5 text-sm sm:text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isSubmitting ? t('submitting') : t('submit')}
            </button>
          )}
        </div>
      </form>
    </>
  );
}
