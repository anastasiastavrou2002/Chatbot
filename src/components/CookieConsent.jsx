// src/components/CookieConsent.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Settings, Check, X } from 'lucide-react';
import { getCookie, setCookie } from '../utils/cookies';

const ConsentContext = createContext(null);

export function ConsentProvider({ children, onlyNecessary = false }) {
  const [consent, setConsent] = useState(() => getCookie('app_consent') || null);
  const [openPrefs, setOpenPrefs] = useState(false);

  const initial = useMemo(
    () => ({ necessary: true, analytics: false, marketing: false, version: 1 }),
    []
  );

  // 🔹 Αν χρησιμοποιούμε ΜΟΝΟ απαραίτητα cookies → καμία ερώτηση/μπάνερ
  useEffect(() => {
    if (onlyNecessary) {
      const minimal = { ...initial, analytics: false, marketing: false };
      // Αν δεν υπάρχει ή είναι διαφορετικό, σώστο
      if (!consent || consent.analytics || consent.marketing) {
        setConsent(minimal);
        setCookie('app_consent', minimal);
      }
    }
  }, [onlyNecessary, initial]); // όχι στο dependency `consent` για να μην γίνεται loop

  // Upgrade παλιών format (αν υπάρχουν)
  useEffect(() => {
    if (consent && !consent.version) {
      const upgraded = { ...initial, ...consent, version: 1 };
      setConsent(upgraded);
      setCookie('app_consent', upgraded);
    }
  }, [consent, initial]);

  const save = (data) => {
    const next = { ...initial, ...data };
    setConsent(next);
    setCookie('app_consent', next);
    setOpenPrefs(false);
  };

  const acceptAll = () => save({ necessary: true, analytics: true, marketing: true });
  const rejectNonEssential = () => save({ necessary: true, analytics: false, marketing: false });

  const hasConsent = (k) => !!(consent && consent[k]);

  return (
    <ConsentContext.Provider
      value={{ consent, hasConsent, openPrefs: () => setOpenPrefs(true), setConsent: save }}
    >
      {children}

      {/* 🔹 Αν onlyNecessary = true, δεν δείχνουμε τίποτα */}
      {!onlyNecessary && !consent && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <div className="mx-auto max-w-6xl p-4">
            <div className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-lg">
              <div className="p-4 sm:p-5">
                <h3 className="text-base font-semibold text-gray-900">Cookies</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Χρησιμοποιούμε cookies για να λειτουργεί σωστά το site και (προαιρετικά) για analytics/marketing.
                  Αν θες λεπτομέρειες, δες την Πολιτική Cookies/Privacy Policy.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
                  <button
                    onClick={() => setOpenPrefs(true)}
                    className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 text-sm inline-flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Προτιμήσεις
                  </button>
                  <button
                    onClick={rejectNonEssential}
                    className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 text-sm"
                  >
                    Απόρριψη μη απαραίτητων
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-sm inline-flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Αποδοχή όλων
                  </button>
                </div>
              </div>
            </div>
          </div>
          {openPrefs && (
            <CookiePreferencesModal
              initial={initial}
              current={consent || initial}
              onClose={() => setOpenPrefs(false)}
              onSave={save}
            />
          )}
        </div>
      )}

      {!onlyNecessary && consent && openPrefs && (
        <CookiePreferencesModal
          initial={initial}
          current={consent}
          onClose={() => setOpenPrefs(false)}
          onSave={save}
        />
      )}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}

function Toggle({ checked, onChange, label, description, disabled }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          disabled ? 'bg-gray-300' : checked ? 'bg-indigo-600' : 'bg-gray-300'
        }`}
        aria-pressed={checked}
        disabled={disabled}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

function CookiePreferencesModal({ initial, current, onClose, onSave }) {
  const [state, setState] = useState(current);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Προτιμήσεις Cookies</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <Toggle checked label="Απαραίτητα" description="Απαιτούνται για τη βασική λειτουργία του site." disabled onChange={() => {}} />
          <Toggle
            checked={!!state.analytics}
            onChange={(v) => setState({ ...state, analytics: v })}
            label="Analytics"
            description="Ανώνυμες μετρήσεις χρήσης (π.χ. στατιστικά)."
          />
          <Toggle
            checked={!!state.marketing}
            onChange={(v) => setState({ ...state, marketing: v })}
            label="Marketing"
            description="Προσωποποίηση/προτάσεις/διαφημίσεις."
          />
        </div>
        <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            onClick={() => onSave({ ...initial, analytics: false, marketing: false })}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 text-sm"
          >
            Απόρριψη μη απαραίτητων
          </button>
          <button
            onClick={() => onSave({ ...initial, analytics: true, marketing: true })}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 text-sm"
          >
            Αποδοχή όλων
          </button>
          <button onClick={() => onSave(state)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-sm">
            Αποθήκευση
          </button>
        </div>
      </div>
    </div>
  );
}
