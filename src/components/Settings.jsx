// src/components/Settings.jsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import { SparklesIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import TextareaAutosize from 'react-textarea-autosize'

export default function Settings({ formData, handleInputChange, errors, disabled = false }) {
  const { t } = useTranslation()

  const baseInputClasses =
    'w-full p-2.5 sm:p-3 pl-9 sm:pl-10 border rounded-xl transition duration-200 bg-slate-50 focus:bg-white focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed'
  const normalClasses = 'border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
  const errorClasses = 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
  const labelClasses = 'block text-xs sm:text-sm font-medium text-slate-600 mb-2'
  const errorTextClasses = 'text-red-600 text-[11px] sm:text-xs mt-1'
  const requiredMark = <span className="text-red-600 ml-1">*</span>

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          {t('conversationSettings')}
        </h2>
      </div>

      <div className="space-y-6 md:space-y-8">
        <div>
          <label htmlFor="bot-name" className={labelClasses}>
            {t('botName')}
            {errors.botName ? requiredMark : null}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute top-2.5 sm:top-3 left-0 flex items-center pl-3">
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-slate-400" />
            </div>
            <TextareaAutosize
              id="bot-name"
              name="botName"
              value={formData.botName}
              onChange={handleInputChange}
              className={`${baseInputClasses} ${errors.botName ? errorClasses : normalClasses} resize-none`}
              placeholder={t('placeholders.botName')}
              minRows={1}
              aria-invalid={Boolean(errors.botName)}
              aria-describedby={errors.botName ? 'botName-error' : undefined}
              disabled={disabled}
            />
          </div>
          {errors.botName && (
            <small id="botName-error" className={errorTextClasses}>
              {t('required')}
            </small>
          )}
        </div>

        <div>
          <label htmlFor="greeting" className={labelClasses}>
            {t('greeting')}
            {errors.greeting ? requiredMark : null}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute top-2.5 sm:top-3 left-0 flex items-center pl-3">
              <SparklesIcon className="h-5 w-5 text-slate-400" />
            </div>
            <TextareaAutosize
              id="greeting"
              name="greeting"
              value={formData.greeting}
              onChange={handleInputChange}
              className={`${baseInputClasses} ${errors.greeting ? errorClasses : normalClasses} resize-none`}
              placeholder={t('placeholders.greeting')}
              minRows={2}
              aria-invalid={Boolean(errors.greeting)}
              aria-describedby={errors.greeting ? 'greeting-error' : undefined}
              disabled={disabled}
            />
          </div>
          {errors.greeting && (
            <small id="greeting-error" className={errorTextClasses}>
              {t('required')}
            </small>
          )}
        </div>

        <div>
          <label htmlFor="persona" className={labelClasses}>
            {t('persona')}
            {errors.persona ? requiredMark : null}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute top-2.5 sm:top-3 left-0 flex items-center pl-3">
              <UserCircleIcon className="h-5 w-5 text-slate-400" />
            </div>
            <TextareaAutosize
              id="persona"
              name="persona"
              value={formData.persona}
              onChange={handleInputChange}
              className={`${baseInputClasses} ${errors.persona ? errorClasses : normalClasses} resize-none`}
              placeholder={t('placeholders.persona')}
              minRows={3}
              aria-invalid={Boolean(errors.persona)}
              aria-describedby={errors.persona ? 'persona-error' : undefined}
              disabled={disabled}
            />
          </div>
          {errors.persona && (
            <small id="persona-error" className={errorTextClasses}>
              {t('required')}
            </small>
          )}
        </div>

        <div>
          <label htmlFor="bot-restrictions" className={labelClasses}>
            {t('botRestrictions')}
            {errors.botRestrictions ? requiredMark : null}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute top-2.5 sm:top-3 left-0 flex items-center pl-3">
              <SparklesIcon className="h-5 w-5 text-slate-400" />
            </div>
            <TextareaAutosize
              id="bot-restrictions"
              name="botRestrictions"
              value={formData.botRestrictions}
              onChange={handleInputChange}
              className={`${baseInputClasses} ${errors.botRestrictions ? errorClasses : normalClasses} resize-none`}
              placeholder={t('placeholders.botRestrictions')}
              minRows={3}
              aria-invalid={Boolean(errors.botRestrictions)}
              aria-describedby={errors.botRestrictions ? 'botRestrictions-error' : undefined}
              disabled={disabled}
            />
          </div>
          {errors.botRestrictions && (
            <small id="botRestrictions-error" className={errorTextClasses}>
              {t('required')}
            </small>
          )}
        </div>
      </div>
    </div>
  )
}
