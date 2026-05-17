import { createContext, useState, useCallback, useMemo } from 'react'
import { en } from '../i18n/en'
import { ru } from '../i18n/ru'

const TRANSLATIONS = { en, ru }
const STORAGE_KEY  = 'coachtool_lang'

export const LanguageContext = createContext(null)

function resolve(obj, key) {
  return key.split('.').reduce((o, k) => o?.[k], obj)
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? 'ru'
  )

  const setLang = useCallback((l) => {
    localStorage.setItem(STORAGE_KEY, l)
    setLangState(l)
  }, [])

  const t = useCallback((key, vars) => {
    const dict = TRANSLATIONS[lang] ?? TRANSLATIONS.ru
    const raw  = resolve(dict, key) ?? key
    if (!vars) return raw
    return String(raw).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
