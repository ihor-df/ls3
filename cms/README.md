# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

## Generate types

Сначала изменяем схему в cms, потом запрос в defineQuery, после этого выполняем генерацию типов:

- npx sanity schemas extract --force
- npx sanity typegen generate

## После долгого перерыва между деплоями

1. npm ci
2. npm run dev-prod
3. проверить вход, создание draft, publish и переводы
4. только потом npm run deploy

Из-за возможного обновления версии sanity "autoUpdates: true" бывает конфликт.
Если после npm run deploy появится предложение обновить локальные версии, выбери Upgrade local versions.
