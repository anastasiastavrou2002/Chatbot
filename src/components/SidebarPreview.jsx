// src/components/SidebarPreview.jsx
import React from 'react';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function SidebarPreview({ steps, currentPage, maxVisitedPage, onGoToPage }) {
  return (
    <div className="z-10 flex h-full w-full flex-col">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-xl sm:text-2xl font-bold text-indigo-500">Chatbot Builder</h1>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Δημιουργήστε το AI chatbot σας σε μερικά βήματα.</p>
      </div>

      <nav className="flex-grow">
        <ol className="relative">
          {steps.map((stepName, index) => {
            const isCompleted = index < currentPage;
            const isActive = index === currentPage;
            const isClickable = index <= maxVisitedPage;

            const buttonClasses = [
              'flex w-full items-center rounded-lg text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500',
              'p-2.5 sm:p-3',
              isClickable ? 'hover:bg-gray-100' : 'cursor-not-allowed',
            ].join(' ');

            const circleClasses = [
              'flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300',
              isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : '',
              isCompleted ? 'bg-indigo-600 text-white' : '',
              !isActive && !isCompleted ? 'border-2 border-gray-300 bg-white text-gray-500' : '',
            ].join(' ');

            const lineClasses = [
              'absolute -z-10 w-0.5 transition-colors duration-300',
              'left-5 sm:left-6 top-9 sm:top-10 h-full',
              isCompleted ? 'bg-indigo-600' : 'bg-gray-200',
            ].join(' ');

            const stepNameClasses = [
              'font-medium break-words',
              isActive ? 'text-indigo-600 font-semibold' : '',
              isCompleted ? 'text-gray-700' : 'text-gray-500',
              !isClickable ? 'text-gray-400' : '',
              'text-sm sm:text-base',
            ].join(' ');

            return (
              <li key={`${stepName}-${index}`} className="relative mb-4 sm:mb-5">
                {index < steps.length - 1 && <div className={lineClasses} />}
                <button
                  onClick={() => onGoToPage && onGoToPage(index)}
                  disabled={!isClickable}
                  className={buttonClasses}
                  aria-current={isActive ? 'step' : undefined}
                  aria-disabled={!isClickable}
                >
                  <div className={circleClasses}>
                    {isCompleted ? <CheckIcon /> : index + 1}
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className={stepNameClasses}>{stepName}</p>
                    {isActive && <p className="text-[11px] sm:text-xs text-gray-500">Επόμενο βήμα</p>}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-auto">
        <p className="text-xs sm:text-sm text-gray-500">© 2025 Your Company</p>
      </div>
    </div>
  );
}
