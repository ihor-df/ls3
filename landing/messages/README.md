# Localization Guidelines

## Source text

- `en.json` is the source of truth for meaning, structure, and available keys.
- `ru.json` can be used as an additional semantic reference where it is already translated.
- Do not invent copy when both English and Russian source values are empty. Leave the value empty until the source copy is approved.
- Add a new key to every locale in the same change. Do not rename or move keys only in selected locales.

## Translation quality

- Translate the intended meaning and user action, not the English wording or sentence structure.
- Use natural language written for a modern website. Headings should be concise, CTA labels should be direct, and explanatory text should be clear rather than promotional by default.
- Follow native capitalization, punctuation, spacing, and word order. Do not copy English Title Case into languages that do not normally use it.
- Keep product names, company names, URLs, promo codes, and technical identifiers unchanged unless an approved localized form exists.
- Prefer established interface terminology such as the local equivalent of "Frequently asked questions" instead of a literal translation of "Popular Questions".
- Avoid unnecessary English loanwords when a familiar native interface term exists, except for established terms such as "Blog" where appropriate.

## Variables and composition

- Preserve ICU variables, plural rules, rich-text tags, and placeholders exactly. For example, `{count}` must remain `{count}` in every locale.
- Translate complete messages. Avoid constructing a sentence by concatenating translated fragments because grammar, cases, articles, and word order differ between languages.
- If a message includes dynamic content, use an ICU placeholder such as `Go to {partner}` instead of combining `Go to` and the partner name in JSX.

## Locale conventions

- `pt`: neutral Portuguese that is clear across major Portuguese-speaking markets; avoid strongly regional wording when a neutral option exists.
- `es`: neutral international Spanish.
- `fr`: standard contemporary French.
- `de`: standard German, with concise interface wording.
- `tr`: contemporary Turkish used in web interfaces.
- `uk`: contemporary Ukrainian; do not translate through Russian when the English meaning differs.
- `zh`: Simplified Chinese (`zh-Hans`) with concise native interface wording. The `/ch` URL prefix does not change the language convention.

## Review checklist

- Every locale has the same key structure as `en.json`.
- Every non-empty English source has a meaningful translation in each target locale.
- Empty source values remain empty rather than receiving speculative copy.
- JSON parses successfully and placeholders match the English source.
- Labels are reviewed in their actual UI context for length, grammar, and the text that appears immediately before or after them.
