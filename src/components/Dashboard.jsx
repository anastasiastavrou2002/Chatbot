import React, { useState } from 'react';
import { Globe, BarChart3, Activity, Shield, Users, Bell, KeyRound, Smartphone, Settings, LogOut, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifLogin, setNotifLogin] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);

  const toggleLang = () => {
    const next = i18n.language === 'el' ? 'en' : 'el';
    i18n.changeLanguage(next);
  };

  const stats = [
    { id: 'lastLogin', label: t('dashboard.lastLogin'), value: '2025-09-25 18:42', icon: Activity },
    { id: 'devices', label: t('dashboard.trustedDevices'), value: '3', icon: Smartphone },
    { id: 'activeSessions', label: t('dashboard.activeSessions'), value: '2', icon: Users },
    { id: 'security', label: t('dashboard.securityScore'), value: '92%', icon: Shield },
  ];

  const sessions = [
    { id: 1, device: 'MacBook Pro • Chrome', location: 'Athens, GR', lastActive: '10m', current: true },
    { id: 2, device: 'iPhone 15 • Safari', location: 'Athens, GR', lastActive: '2h', current: false },
    { id: 3, device: 'Windows • Edge', location: 'Patras, GR', lastActive: '3d', current: false },
  ];

  const activities = [
    { id: 1, type: 'login', title: t('dashboard.activity.loginSuccess'), time: '10m', ok: true },
    { id: 2, type: 'otp', title: t('dashboard.activity.otpRequested'), time: '2h', ok: true },
    { id: 3, type: 'password', title: t('dashboard.activity.passwordChanged'), time: '3d', ok: true },
    { id: 4, type: 'login', title: t('dashboard.activity.loginBlocked'), time: '5d', ok: false },
  ];

  return (
    <div className="w-full max-w-6xl">
      <div className="rounded-2xl overflow-hidden bg-transparent shadow-none border-0">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 relative rounded-2xl">
          <button
            onClick={toggleLang}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 flex items-center gap-1 text-sm"
          >
            <Globe className="h-4 w-4" />
            {i18n.language === 'el' ? 'EN' : 'EL'}
          </button>
          <h1 className="text-2xl font-bold text-white text-center">{t('dashboard.title')}</h1>
          <p className="text-indigo-100 text-center mt-2">{t('dashboard.subtitle')}</p>
        </div>

        <div className="p-6 md:p-8 bg-transparent">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.id} className="rounded-xl border border-gray-200/60 bg-white/60 backdrop-blur px-5 py-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-gray-500 truncate">{s.label}</div>
                    <div className="text-xl font-semibold text-gray-900 truncate">{s.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/70">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-base font-semibold text-gray-900">{t('dashboard.securityOverview')}</h2>
                  </div>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    {t('dashboard.manageSecurity')}
                  </button>
                </div>
                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="rounded-xl border border-gray-200/60 p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4 text-indigo-600" />
                        {t('dashboard.otpStatus')}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium text-gray-900">{t('dashboard.enabled')}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{t('dashboard.otpHint')}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200/60 p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <KeyRound className="h-4 w-4 text-indigo-600" />
                        {t('dashboard.passwordHealth')}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium text-gray-900">{t('dashboard.strong')}</span>
                      </div>
                      <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">{t('dashboard.changePassword')}</button>
                    </div>
                    <div className="rounded-xl border border-gray-200/60 p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Smartphone className="h-4 w-4 text-indigo-600" />
                        {t('dashboard.deviceApprovals')}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-amber-500" />
                        <span className="font-medium text-gray-900">{t('dashboard.pendingReview')}</span>
                      </div>
                      <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">{t('dashboard.reviewDevices')}</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/70">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-base font-semibold text-gray-900">{t('dashboard.recentActivity')}</h2>
                  </div>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">{t('dashboard.viewAll')}</button>
                </div>
                <ul className="divide-y divide-gray-200/70">
                  {activities.map((a) => (
                    <li key={a.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${a.ok ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                          {a.ok ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-600" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{a.title}</div>
                          <div className="text-xs text-gray-500">{t('dashboard.timeAgo', { time: a.time })}</div>
                        </div>
                      </div>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">{t('dashboard.details')}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/70">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-base font-semibold text-gray-900">{t('dashboard.sessions')}</h2>
                  </div>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    <LogOut className="h-4 w-4" />
                    {t('dashboard.signOutAll')}
                  </button>
                </div>
                <ul className="divide-y divide-gray-200/70">
                  {sessions.map((s) => (
                    <li key={s.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{s.device}</div>
                          <div className="text-xs text-gray-500">{s.location} • {t('dashboard.active', { time: s.lastActive })}</div>
                        </div>
                        {s.current && <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">{t('dashboard.thisDevice')}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/70">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-base font-semibold text-gray-900">{t('dashboard.notifications')}</h2>
                  </div>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm text-gray-800">{t('dashboard.emailAlerts')}</span>
                    </div>
                    <button
                      onClick={() => setNotifEmail(!notifEmail)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${notifEmail ? 'bg-indigo-600' : 'bg-gray-300'}`}
                      aria-pressed={notifEmail}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${notifEmail ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm text-gray-800">{t('dashboard.loginAlerts')}</span>
                    </div>
                    <button
                      onClick={() => setNotifLogin(!notifLogin)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${notifLogin ? 'bg-indigo-600' : 'bg-gray-300'}`}
                      aria-pressed={notifLogin}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${notifLogin ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm text-gray-800">{t('dashboard.securityAlerts')}</span>
                    </div>
                    <button
                      onClick={() => setNotifSecurity(!notifSecurity)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${notifSecurity ? 'bg-indigo-600' : 'bg-gray-300'}`}
                      aria-pressed={notifSecurity}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${notifSecurity ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/70">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-base font-semibold text-gray-900">{t('dashboard.quickActions')}</h2>
                  </div>
                </div>
                <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="w-full rounded-lg px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all">
                    {t('dashboard.enable2fa')}
                  </button>
                  <button className="w-full rounded-lg px-4 py-3 border border-gray-300 text-gray-800 hover:bg-gray-50 transition-all">
                    {t('dashboard.manageDevices')}
                  </button>
                  <button className="w-full rounded-lg px-4 py-3 border border-gray-300 text-gray-800 hover:bg-gray-50 transition-all">
                    {t('dashboard.backupCodes')}
                  </button>
                  <button className="w-full rounded-lg px-4 py-3 border border-gray-300 text-gray-800 hover:bg-gray-50 transition-all">
                    {t('dashboard.accountSettings')}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
