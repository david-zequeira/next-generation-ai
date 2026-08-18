"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import { dictionaries, type Dict, type Locale } from "./dictionaries";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dict: Dict;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "es",
  setLocale: () => {},
  dict: dictionaries.es,
});

const STORAGE_KEY = "ng-locale";

/**
 * Idioma del sitio: preferencia guardada → idioma del navegador → ESPAÑOL.
 * El defecto es "es" a propósito: es lo que queda congelado en el HTML
 * prerenderizado del export estático, y por tanto lo que indexa Google y lo
 * que ven los previsualizadores de enlaces. El mercado de Asenix es España;
 * con "en" por defecto, el contenido español no existía para un buscador.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "en" || saved === "es") {
      setLocaleState(saved);
    } else if (!navigator.language.toLowerCase().startsWith("es")) {
      setLocaleState("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dict: dictionaries[locale] }}>
      {/* reducedMotion="user": Framer desactiva transforms animados si el SO lo pide */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

export function useDict(): Dict {
  return useContext(LocaleContext).dict;
}
