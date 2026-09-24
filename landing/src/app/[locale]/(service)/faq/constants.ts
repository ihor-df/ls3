export const FAQ_ITEMS_BY_CATEGORY = {
  "common-questions": [
    "what-is-antidetect-hybrid-mode",
    "are-fingerprints-preserved-when-transferring-sessions",
    "what-data-is-the-browser-sending",
    "can-my-session-data-be-stored-locally",
    "is-my-data-safe",
    "what-if-socks-doesnt-have-its-own-dns",
    "how-and-where-can-i-check-my-session-fingerprints",
    "is-it-necessary-to-install-additional-software-for-the-browser-to-work",
    "how-to-learn-about-all-the-intricacies-and-features-of-the-browser",
    "can-i-use-multiple-copies-of-the-software-at-the-same-time",
    "can-i-use-different-connection-types-at-the-same-time",
  ],
  payment: [
    "how-do-i-pay-for-the-service",
    "do-i-need-to-contact-support-after-making-a-payment",
    "what-happens-after-the-license-expires",
    "what-should-i-do-if-i-made-a-payment-but-it-didnt-arrive",
  ],
  license: [
    "what-is-the-license-duration",
    "can-i-lose-my-license",
    "what-should-i-do-if-the-program-doesnt-meet-my-expectations",
    "can-i-recover-my-lost-password",
  ],
  "problem-solving": [
    "whats-the-best-way-to-contact-support",
    "is-the-program-supported-on-windows7",
    "does-the-program-work-on-virtual-machines",
    "what-to-do-if-the-antivirus-reacts-to-the-software",
    "what-to-do-if-you-find-a-bug-or-problem",
    "what-to-do-if-you-need-additional-functionality",
    "can-i-make-suggestions-for-improving-the-software",
  ],
} as const;

export type FAQCategorySlug = keyof typeof FAQ_ITEMS_BY_CATEGORY;

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type FAQItemsByCategory = Record<FAQCategorySlug, FAQItem[]>;

export const FAQ_CATEGORY_SLUGS = Object.keys(FAQ_ITEMS_BY_CATEGORY) as FAQCategorySlug[];

export const FAQ_CATEGORIES = FAQ_CATEGORY_SLUGS.map((slug) => ({
  _id: slug,
  slug,
}));

export const isFAQCategorySlug = (slug: string): slug is FAQCategorySlug => Object.hasOwn(FAQ_ITEMS_BY_CATEGORY, slug);
