import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import TextareaAutosize from 'react-textarea-autosize'

export default function BasicInfo({ formData, handleInputChange, errors, disabled = false }) {
  const { t } = useTranslation()

  const industryOptions = useMemo(
    () => [
      'technology',
      'finance',
      'healthcare',
      'education',
      'retail',
      'manufacturing',
      'hospitality',
      'media',
      'real_estate',
      'transportation',
      'energy',
      'government',
      'non_profit',
      'other',
    ],
    []
  )

  // Mobile-first classes
  const baseInputClasses =
    'w-full p-3 pl-9 sm:pl-10 border rounded-xl transition duration-200 bg-slate-50 focus:bg-white focus:outline-none text-base sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed'
  const normalClasses = 'border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
  const errorClasses = 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
  const labelClasses = 'block text-xs sm:text-sm font-medium text-slate-600 mb-2'
  const errorTextClasses = 'text-red-600 text-xs mt-1'
  const sectionTitle = 'text-lg sm:text-xl font-semibold text-slate-800'
  const requiredMark = <span className="text-red-600 ml-1">*</span>

  const normalizeUrl = useCallback((value) => {
    if (!value) return value
    const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value)
    return hasScheme ? value : `https://${value}`
  }, [])

  const handleWebsiteBlur = (e) => {
    const v = e.target.value?.trim()
    if (!v) return
    const normalized = normalizeUrl(v)
    if (normalized !== v) {
      handleInputChange({ target: { name: 'websiteURL', value: normalized } })
    }
  }

  const showOther = formData.industry === 'other'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {t('basicInfo')}
        </h2>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Company Details */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className={sectionTitle}>{t('companyDetails')}</h3>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="company-name" className={labelClasses}>
                {t('companyName')}
                {errors.companyName ? requiredMark : null}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-slate-400" />
                </div>
                <TextareaAutosize
                  id="company-name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`${baseInputClasses} ${errors.companyName ? errorClasses : normalClasses} resize-none`}
                  placeholder={t('placeholders.companyExample')}
                  minRows={1}
                  aria-invalid={Boolean(errors.companyName)}
                  aria-describedby={errors.companyName ? 'companyName-error' : undefined}
                  disabled={disabled}
                  autoComplete="organization"
                />
              </div>
              {errors.companyName && (
                <small id="companyName-error" className={errorTextClasses}>
                  {t('required')}
                </small>
              )}
            </div>

            <div>
              <label htmlFor="industry" className={labelClasses}>
                {t('industry')}
                {errors.industry ? requiredMark : null}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
                  <WrenchScrewdriverIcon className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`${baseInputClasses} ${errors.industry ? errorClasses : normalClasses}`}
                  aria-invalid={Boolean(errors.industry)}
                  aria-describedby={errors.industry ? 'industry-error' : undefined}
                  disabled={disabled}
                >
                  <option value="">{t('selectIndustry')}</option>
                  {industryOptions.map((key) => (
                    <option key={key} value={key}>
                      {t(`industries.${key}`)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.industry && (
                <small id="industry-error" className={errorTextClasses}>
                  {t('required')}
                </small>
              )}
            </div>

            {showOther && (
              <div className="md:col-span-2">
                <label htmlFor="industryOther" className={labelClasses}>
                  {t('other')}
                  {errors.industryOther ? requiredMark : null}
                </label>
                <TextareaAutosize
                  id="industryOther"
                  name="industryOther"
                  value={formData.industryOther}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-xl bg-slate-50 ${
                    errors.industryOther ? errorClasses : normalClasses
                  } resize-none pl-3 text-base sm:text-sm`}
                  placeholder={t('placeholders.industryOther')}
                  minRows={1}
                  aria-invalid={Boolean(errors.industryOther)}
                  aria-describedby={errors.industryOther ? 'industryOther-error' : undefined}
                  disabled={disabled}
                />
                {errors.industryOther && (
                  <small id="industryOther-error" className={errorTextClasses}>
                    {t('required')}
                  </small>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-slate-200" />

        {/* Web Presence */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className={sectionTitle}>{t('webPresence')}</h3>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="website" className={labelClasses}>
                {t('website')}
                {errors.websiteURL ? requiredMark : null}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
                  <GlobeAltIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  id="website"
                  name="websiteURL"
                  value={formData.websiteURL}
                  onChange={handleInputChange}
                  onBlur={handleWebsiteBlur}
                  className={`${baseInputClasses} ${errors.websiteURL ? errorClasses : normalClasses}`}
                  placeholder={t('placeholders.website')}
                  inputMode="url"
                  aria-invalid={Boolean(errors.websiteURL)}
                  aria-describedby={errors.websiteURL ? 'website-error' : undefined}
                  disabled={disabled}
                  autoComplete="url"
                />
              </div>
              {errors.websiteURL && (
                <small id="website-error" className={errorTextClasses}>
                  {t('required')}
                </small>
              )}
            </div>

            <div>
              <label htmlFor="domain" className={labelClasses}>
                {t('domain')}
                {errors.domain ? requiredMark : null}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
                  <GlobeAltIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  className={`${baseInputClasses} ${errors.domain ? errorClasses : normalClasses}`}
                  placeholder={t('placeholders.domain')}
                  pattern="^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$"
                  inputMode="url"
                  aria-invalid={Boolean(errors.domain)}
                  aria-describedby={errors.domain ? 'domain-error' : undefined}
                  disabled={disabled}
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
              {errors.domain && (
                <small id="domain-error" className={errorTextClasses}>
                  {t('required')}
                </small>
              )}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-slate-200" />

        {/* Audience & Description */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className={sectionTitle}>{t('audienceAndDescription')}</h3>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="description" className={labelClasses}>
                {t('description')}
                {errors.description ? requiredMark : null}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-2 sm:pl-3">
                  <PencilSquareIcon className="h-5 w-5 text-slate-400" />
                </div>
                <TextareaAutosize
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`${baseInputClasses} ${errors.description ? errorClasses : normalClasses} resize-none`}
                  placeholder={t('placeholders.description')}
                  minRows={3}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? 'description-error' : undefined}
                  disabled={disabled}
                />
              </div>
              {errors.description && (
                <small id="description-error" className={errorTextClasses}>
                  {t('required')}
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
