// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// ✅ Load JSON and extract .default so resources are plain objects
const resources = {
  en: { common: (await import("./locales/en/common.json")).default },
  ar: { common: (await import("./locales/ar/common.json")).default },
};

const isRTL = (lng) => ["ar", "he", "fa", "ur"].includes(lng);

const applyHtmlDir = (lng) => {
  const short = (lng || "en").split("-")[0]; // normalize ar-OM -> ar
  const dir = isRTL(short) ? "rtl" : "ltr";
  const html = document.documentElement;
  html.setAttribute("lang", short);
  html.setAttribute("dir", dir);
};

await i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ["en", "ar"],
    fallbackLng: "en",
    // ✅ normalize region codes (ar-OM/en-US -> ar/en)
    nonExplicitSupportedLngs: true,
    load: "languageOnly",

    ns: ["common"],
    defaultNS: "common",

    interpolation: { escapeValue: false },

    detection: {
      order: ["localStorage", "querystring", "navigator", "htmlTag"],
      caches: ["localStorage"],
      // ✅ match the key you actually write below
      lookupLocalStorage: "lng",
    },

    returnEmptyString: false,
    react: { useSuspense: false }, // resources already loaded synchronously
    debug: false,
  });

applyHtmlDir(i18n.resolvedLanguage);

i18n.on("languageChanged", (lng) => {
  // ✅ keep using your 'lng' key consistently
  localStorage.setItem("lng", lng);
  applyHtmlDir(lng);
});

export default i18n;
