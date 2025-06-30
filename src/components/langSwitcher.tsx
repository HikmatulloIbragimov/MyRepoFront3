import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LangSwitcher() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.resolvedLanguage);

  const langs = ["uz", "ru", "en"];

  useEffect(() => {
    const handleLangChanged = (lng: string) => {
      setLang(lng);
    };

    i18n.on("languageChanged", handleLangChanged);

    return () => {
      i18n.off("languageChanged", handleLangChanged);
    };
  }, [i18n]);

  return (
    <div className="flex items-center justify-end">
      <p className="flex text-[#8c8c5f] text-base font-bold leading-normal tracking-[0.015em] shrink-0 select-none">
        {langs.map((lng, i) => (
          <span key={lng} className="flex items-center">
            <span
              onClick={() => i18n.changeLanguage(lng)}
              className={`cursor-pointer ${
                lang === lng ? "underline" : "opacity-60 hover:opacity-100"
              }`}
              style={{ userSelect: "none" }}
              aria-label={`Switch language to ${lng.toUpperCase()}`}
            >
              {lng.toUpperCase()}
            </span>
            {i < langs.length - 1 && (
              <span className="px-1 select-none opacity-50">|</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}
