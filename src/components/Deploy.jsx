// src/components/Deploy.jsx
import React, { useMemo, useState } from 'react'

export default function Deploy({ formData = {}, disabled = false, onPublish, apiKey, widgetScript }) {
  const botId = apiKey || formData.widgetId || formData.botId || 'your-bot-id'
  const primary = formData.primaryColor || '#4f46e5'
  const theme = formData.themeStyle || 'Minimal'
  const position = formData.position || 'Bottom Right'
  const domainInitial = (formData.domain || '').trim()

  const [tab, setTab] = useState('script')
  const [copied, setCopied] = useState('')
  const [published, setPublished] = useState(false)
  const [domains, setDomains] = useState(Array.from(new Set([domainInitial].filter(Boolean))))
  const [newDomain, setNewDomain] = useState('')

  const posKey = useMemo(() => {
    const p = String(position || '').toLowerCase()
    if (p.includes('κάτω') && p.includes('δεξ')) return 'bottom-right'
    if (p.includes('κάτω') && p.includes('αρισ')) return 'bottom-left'
    if (p.includes('πάνω') && p.includes('δεξ')) return 'top-right'
    if (p.includes('πάνω') && p.includes('αρισ')) return 'top-left'
    if (p.includes('bottom') && p.includes('right')) return 'bottom-right'
    if (p.includes('bottom') && p.includes('left')) return 'bottom-left'
    if (p.includes('top') && p.includes('right')) return 'top-right'
    if (p.includes('top') && p.includes('left')) return 'top-left'
    return 'bottom-right'
  }, [position])

  const configObj = useMemo(() => ({
    botId,
    theme,
    position: posKey,
    primaryColor: primary,
    suggestions: (formData.suggestedPrompts || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 6),
    greeting: (formData.greeting || "Welcome! I'm your AI assistant. How can I help you today?").trim(),
    botName: (formData.botName || 'AI assistant').trim(),
  }), [botId, theme, posKey, primary, formData.suggestedPrompts, formData.greeting, formData.botName])

  const scriptSnippet = widgetScript || `<script>\n  window.__chatbotConfig = ${JSON.stringify(configObj, null, 2)};\n</script>\n<script src="https://cdn.example.com/chat-widget.min.js" defer></script>`

  const reactSnippet = `import { ChatWidget } from '@example/chat-widget-react'\n\nexport default function App() {\n  return (\n    <ChatWidget\n      botId="${botId}"\n      theme="${theme}"\n      position="${posKey}"\n      primaryColor="${primary}"\n      greeting=${JSON.stringify(configObj.greeting)}\n      botName=${JSON.stringify(configObj.botName)}\n      suggestions={${JSON.stringify(configObj.suggestions)}}\n    />\n  )\n}`

  const iframeSnippet = `<iframe\n  src="https://widget.example.com/embed?botId=${encodeURIComponent(botId)}&theme=${encodeURIComponent(theme)}&position=${encodeURIComponent(posKey)}&primary=${encodeURIComponent(primary)}"\n  style="width: 100%; height: 600px; border: 0; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08)"\n  allow="clipboard-write *; microphone *;"\n  loading="lazy"\n></iframe>`

  const checklist = [
    'Σωστή επιλογή χρώματος/θέματος',
    'Σωστή θέση widget',
    'Το domain έχει προστεθεί στο allowlist',
    'Το script φορτώνει στην τελική σελίδα',
  ]

  const onCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(''), 1200)
    } catch {}
  }

  const addDomain = () => {
    const d = newDomain.trim()
    if (!d) return
    if (!domains.includes(d)) setDomains(prev => [...prev, d])
    setNewDomain('')
  }

  const removeDomain = (d) => {
    setDomains(prev => prev.filter(x => x !== d))
  }

  const handlePublish = async () => {
    setPublished(true)
    if (onPublish) {
      try { await onPublish({ botId, domains, config: configObj }) } catch {}
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Deploy</h2>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 text-sm ${published ? 'text-green-600' : 'text-slate-600'}`}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: published ? '#16a34a' : '#94a3b8' }} />
            {published ? 'Published' : 'Not published'}
          </span>
          <button
            type="button"
            onClick={handlePublish}
            disabled={disabled}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            style={{ backgroundColor: published ? '#16a34a' : undefined }}
          >
            {published ? 'Published' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTab('script')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium border ${tab === 'script' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-700'}`}
              >
                Script tag
              </button>
              <button
                type="button"
                onClick={() => setTab('react')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium border ${tab === 'react' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-700'}`}
              >
                React
              </button>
              <button
                type="button"
                onClick={() => setTab('iframe')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium border ${tab === 'iframe' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-700'}`}
              >
                Iframe
              </button>
            </div>

            <div className="relative">
              <pre className="max-h-[360px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6">
                <code className="whitespace-pre-wrap">{tab === 'script' ? scriptSnippet : tab === 'react' ? reactSnippet : iframeSnippet}</code>
              </pre>
              <button
                type="button"
                onClick={() => onCopy(tab === 'script' ? scriptSnippet : tab === 'react' ? reactSnippet : iframeSnippet, tab)}
                className="absolute right-3 top-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {copied === tab ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-700">Checklist</div>
            <ul className="space-y-2 text-sm text-slate-700">
              {checklist.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full" style={{ backgroundColor: primary }} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-2 text-sm font-semibold text-slate-700">Widget Config</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-slate-500">API Key</div>
              <button
                type="button"
                onClick={() => onCopy(apiKey || '', 'apikey')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 underline cursor-pointer text-left"
              >
                {copied === 'apikey' ? 'Copied!' : 'Copy API Key'}
              </button>
              <div className="text-slate-500">Theme</div>
              <div className="font-medium text-slate-800">{theme}</div>
              <div className="text-slate-500">Position</div>
              <div className="font-medium text-slate-800">{posKey}</div>
              <div className="text-slate-500">Primary</div>
              <div className="font-medium text-slate-800">{primary}</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-2 text-sm font-semibold text-slate-700">Allowed Domains</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addDomain}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-white font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>

            {domains.length > 0 && (
              <ul className="mt-3 space-y-2">
                {domains.map((d) => (
                  <li key={d} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                    <span className="text-slate-700">{d}</span>
                    <button
                      type="button"
                      onClick={() => removeDomain(d)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700" />
        </div>
      </div>
    </div>
  )
}
