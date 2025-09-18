// src/components/Deploy.jsx
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Deploy({ formData = {}, disabled = false, onPublish }) {
  const { t } = useTranslation()

  const botId = formData.widgetId || formData.botId || 'your-bot-id'
  const primary = formData.primaryColor || '#4f46e5'
  const theme = formData.themeStyle || 'Minimal'
  const position = formData.position || 'Bottom Right'
  const [copied, setCopied] = useState('')
  const [published, setPublished] = useState(false)

  const normalizePosition = (pos) => {
    const p = String(pos || '').toLowerCase()
    if (p.includes('κάτω') && p.includes('δεξ')) return 'bottom-right'
    if (p.includes('κάτω') && p.includes('αρισ')) return 'bottom-left'
    if (p.includes('πάνω') && p.includes('δεξ')) return 'top-right'
    if (p.includes('πάνω') && p.includes('αρισ')) return 'top-left'
    if (p.includes('bottom') && p.includes('right')) return 'bottom-right'
    if (p.includes('bottom') && p.includes('left')) return 'bottom-left'
    if (p.includes('top') && p.includes('right')) return 'top-right'
    if (p.includes('top') && p.includes('left')) return 'top-left'
    return 'bottom-right'
  }
  const posKey = normalizePosition(position)

  const configObj = useMemo(
    () => ({
      botId,
      theme,
      position: posKey,
      primaryColor: primary,
      suggestions: (formData.suggestedPrompts || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, 6),
      greeting: formData.greeting?.trim() || t('deploy.defaults.greeting'),
      botName: formData.botName?.trim() || t('deploy.defaults.botName'),
    }),
    [botId, theme, posKey, primary, formData.suggestedPrompts, formData.greeting, formData.botName, t]
  )

  const scriptSnippet =
`<script>
  window.__chatbotConfig = ${JSON.stringify(configObj, null, 2)};
</script>
<script src="https://cdn.example.com/chat-widget.min.js" defer></script>`;

  const checklist = useMemo(() => [
    t('deploy.checklist.item1'),
    t('deploy.checklist.item2'),
    t('deploy.checklist.item3'),
    t('deploy.checklist.item4'),
  ], [t])

  const onCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied('script')
      setTimeout(() => setCopied(''), 1200)
    } catch {}
  }

  const handlePublish = async () => {
    setPublished(true)
    if (onPublish) {
      try { await onPublish({ botId, config: configObj }) } catch {}
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{t('deploy.title')}</h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className={`inline-flex items-center gap-2 text-xs sm:text-sm ${published ? 'text-green-600' : 'text-slate-600'}`}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: published ? '#16a34a' : '#94a3b8' }} />
            {published ? t('deploy.status.published') : t('deploy.status.notPublished')}
          </span>
          <button
            type="button"
            onClick={handlePublish}
            disabled={disabled}
            className="rounded-lg px-3 py-2 text-xs sm:text-sm text-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            style={{ backgroundColor: published ? '#16a34a' : primary }}
          >
            {published ? t('deploy.publishButton.published') : t('deploy.publishButton.publish')}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-700">
              {t('deploy.tabs.script')}
            </div>
            <div className="relative">
              <pre className="max-h-[320px] sm:max-h-[360px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4 text-xs sm:text-sm leading-6">
                <code className="whitespace-pre-wrap break-words">{scriptSnippet}</code>
              </pre>
              <button
                type="button"
                onClick={() => onCopy(scriptSnippet)}
                className="absolute right-3 top-3 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {copied === 'script' ? t('deploy.copyButton.copied') : t('deploy.copyButton.copy')}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-700">{t('deploy.checklist.title')}</div>
            <ul className="space-y-2 text-sm text-slate-700">
              {checklist.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full" style={{ backgroundColor: primary }} />
                  <span className="break-words">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-2 text-sm font-semibold text-slate-700">{t('deploy.config.title')}</div>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="text-slate-500">{t('deploy.config.botId')}</div>
              <div className="font-medium text-slate-800 break-words">{botId}</div>
              <div className="text-slate-500">{t('deploy.config.theme')}</div>
              <div className="font-medium text-slate-800 break-words">{theme}</div>
              <div className="text-slate-500">{t('deploy.config.position')}</div>
              <div className="font-medium text-slate-800 break-words">{posKey}</div>
              <div className="text-slate-500">{t('deploy.config.primary')}</div>
              <div className="font-medium text-slate-800 break-words">{primary}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
