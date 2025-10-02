// src/SidebarPreview.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SidebarPreview({
  steps,
  currentPage,
  maxVisitedPage,
  onGoToPage,
  isMobile = false,
  showHeader = true,
}) {
  const { t } = useTranslation();
  const renderHeader = !isMobile && showHeader;

  return (
    <aside className="w-full">
      {renderHeader && (
        <div className="mb-4">
          <h1 className="text-xl font-bold text-indigo-600">{t('appTitle')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('sidebarSubtitle', 'Δημιουργήστε το AI chatbot σας σε μερικά βήματα.')}
          </p>
        </div>
      )}

      <nav aria-label={t('stepsTitle', 'Βήματα')} className={isMobile ? 'mt-0' : 'mt-4'}>
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-3.5 top-3.5 bottom-3.5 w-0.5 -translate-x-1/2 bg-slate-200"
          />

          {steps.map((label, idx) => {
            const unlocked = idx <= maxVisitedPage;
            const active = idx === currentPage;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => unlocked && onGoToPage(idx)}
                disabled={!unlocked}
                className={[
                  'w-full flex items-center gap-3 py-3 text-left',
                  unlocked ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex items-center justify-center w-7 h-7 rounded-full border',
                    'relative',
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300'
                      : unlocked
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-300',
                  ].join(' ')}
                >
                  {unlocked && !active ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </span>
                <span className={active ? 'text-indigo-600 font-medium' : 'text-slate-700'}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
