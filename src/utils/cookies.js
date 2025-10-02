// src/utils/cookies.js
export function setCookie(name, value, days = 365, opts = {}) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${d.toUTCString()}`;
  const path = `; path=${opts.path || '/'}`;
  const sameSite = `; SameSite=${opts.sameSite || 'Lax'}`;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    typeof value === 'string' ? value : JSON.stringify(value)
  )}${expires}${path}${sameSite}${secure}`;
}

export function getCookie(name) {
  const key = `${encodeURIComponent(name)}=`;
  const ca = document.cookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(key) === 0) {
      const raw = decodeURIComponent(c.substring(key.length, c.length));
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    }
  }
  return null;
}

export function eraseCookie(name, opts = {}) {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${opts.path || '/'}; SameSite=${opts.sameSite || 'Lax'}`;
}
