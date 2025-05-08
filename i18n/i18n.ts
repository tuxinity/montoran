"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import translationID from "./locales/id.json";
import translationEN from "./locales/en.json";

// the translations
const resources = {
  id: {
    translation: translationID,
  },
  en: {
    translation: translationEN,
  },
};

// Inisialisasi i18n hanya di sisi client
if (typeof window !== "undefined") {
  i18n
    // detect user language
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next
    .use(initReactI18next)
    // init i18next
    .init({
      resources,
      fallbackLng: "id",
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      },
    });
} else {
  // Inisialisasi minimal untuk SSR
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "id",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
