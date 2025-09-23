// src/components/Capabilities.jsx
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function Capabilities({ formData, handleInputChange, disabled = false }) {
  const { t } = useTranslation()

  const sectionTitle = 'text-lg sm:text-xl font-semibold text-slate-800'
  const groupTitle = 'text-xs sm:text-sm font-semibold text-slate-600'
  const checkboxLabel = 'text-sm sm:text-base text-slate-700 leading-tight break-words'
  const cardClasses = 'rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm'

  // Προσθέτουμε το feedback ως απλό toggle (χωρίς extra options panel)
  const coreFeatures = useMemo(
    () => [
      { key: 'leadCapture', label: t('features.leadCaptureForms') },
      { key: 'appointmentScheduling', label: t('features.appointmentScheduling') },
      { key: 'feedbackCollection', label: t('features.feedbackCollection') }
    ],
    [t]
  )

  const leadCaptureFields = useMemo(
    () => [
      { key: 'name', label: t('fields.name') },
      { key: 'email', label: t('fields.email') },
      { key: 'phone', label: t('fields.phone') },
      { key: 'company', label: t('fields.company') },
      { key: 'message', label: t('fields.message') },
    ],
    [t]
  )

  const core = formData?.coreFeatures || {}
  const fields = formData?.leadCaptureFields || {}

  const onToggle = (path, current) => {
    const [group, key] = path.split('.')
    const updated = { ...(formData[group] || {}), [key]: !current }
    handleInputChange({ target: { name: group, value: updated } })
  }

  const leadEnabled = !!core.leadCapture

  return (
    <div className={cardClasses}>
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          {t('capabilities.title')}
        </h2>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* Core features */}
        <section className="space-y-3 md:space-y-4">
          <h3 className={sectionTitle}>{t('capabilities.coreFeatures')}</h3>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map(({ key, label }) => (
              <label key={key} className="inline-flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  checked={!!core[key]}
                  onChange={() => onToggle(`coreFeatures.${key}`, !!core[key])}
                  disabled={disabled}
                  aria-label={label}
                />
                <span className={checkboxLabel}>{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Lead capture fields (εμφανίζεται μόνο αν είναι ενεργό το leadCapture) */}
        {leadEnabled && (
          <section className="space-y-3 md:space-y-4" aria-hidden={!leadEnabled}>
            <h4 className={groupTitle}>{t('capabilities.leadCaptureFields')}</h4>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {leadCaptureFields.map(({ key, label }) => (
                <label key={key} className="inline-flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={!!fields[key]}
                    onChange={() => onToggle(`leadCaptureFields.${key}`, !!fields[key])}
                    disabled={disabled}
                    aria-label={label}
                  />
                  <span className={checkboxLabel}>{label}</span>
                </label>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
