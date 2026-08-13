import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru", "pt", "es", "fr", "de", "tr", "uk", "zh"], // A list of all locales that are supported
  defaultLocale: "en", // Used when no locale matches
  localePrefix: {
    mode: "as-needed", // rewrites "/en" to "/"
    prefixes: {
      uk: "/ua",
      zh: "/ch",
    },
  },
});
