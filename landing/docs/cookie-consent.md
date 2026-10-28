# Cookie consent

The notice and settings UI are ported from the NOID landing site. They retain its layout, animation, four categories, draft settings and close behavior, with Linken Sphere colors and ABC Diatype.

Consent is stored in `ls_cookie_consent_v1` for 180 days (`Path=/`, `SameSite=Lax`, and `Secure` on HTTPS). Increment the storage version after changing the cookie policy. Essential cookies stay enabled. Optional categories remain unavailable to services until a decision has been saved, although the initial settings switches match the reference and start enabled.

On a first visit, the client requests `/api/geo`. EU/EEA countries, the UK, Switzerland and unknown locations receive the notice. Other countries automatically receive all preferences, matching the reference. Failed or slow lookups fall back to displaying the notice. Saved decisions are restored before any optional services are enabled.

## Configuration

Set these **server environment variables** for the Next.js build/deployment:

| Variable           | Value                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `GTM_ID`           | Linken Sphere's own `GTM-…` container ID; omit to disable GTM and page-view tracking                                                         |
| `CRISP_WEBSITE_ID` | Linken Sphere's own Crisp website ID; omit to disable the chat                                                                               |
| `GEOIP_DB_PATH`    | Optional absolute path to the City MMDB file; defaults to `data/geoip/GeoIP2-City.mmdb` under the landing working directory                  |
| `GEOIP_IP_HEADER`  | Optional IP header supplied and overwritten by the deployment's trusted proxy; otherwise `x-real-ip`, then the first `x-forwarded-for` entry |

GTM and Crisp IDs are public integration identifiers. Never use NOID's IDs. Rebuild prerendered pages after changing these IDs. GTM loads only when `isProductionDomain()` is true (`NEXT_PUBLIC_APP_DOMAIN=ls.app`); analytics functions use the same check internally before sending consent updates or events. There are no hard-coded production credentials or a dependency on Cloudflare.

The reverse proxy must overwrite the chosen client IP header. Do not forward arbitrary client-provided IP headers as trusted values. Direct local requests without a proxy header intentionally return an unknown country. `/api/geo` returns only the country, never the client's IP, and is not cached.

The root layout uses Next.js Script with `beforeInteractive` to set Consent Mode v2 defaults to `denied` before GTM loads. Saving/restoring preferences updates consent and removes cookies for denied categories through the same function. Advertising and analytics are independent. The container's tags must also have the appropriate consent checks configured. Route page-view events are sent only with analytics consent; avoid duplicate page views from separate GTM history triggers or automatic GA configuration.

Page-view tracking and the Crisp lifecycle live together in `ConsentServices` inside `context-providers.tsx`. The SDK is imported only after functional consent. Revoking functional consent closes/hides the chat and resets its session; a consent-controlled style keeps the chat root hidden if Crisp recreates its launcher. The existing YouTube player is outside this migration.

## Database and Docker deployment

The local `data/geoip/GeoIP2-City.mmdb` is copied from NOID. MMDB files are intentionally ignored by Git and must be supplied during deployment. The database is server-only and never belongs in `public/`. Next.js output tracing includes the bundled default database for `/api/geo` when it is present at build time.

For Docker, mount the **whole database directory** read-only into the application, for example `/var/lib/linken-sphere/geoip:/app/data/geoip:ro` if the application's working directory is `/app`. Alternatively set `GEOIP_DB_PATH` to another mounted path. There is no auto-update container, scheduler, or request-time download.

### Manual replacement

1. Download the current **City MMDB** from the MaxMind account portal: <https://www.maxmind.com/en/accounts/current/geoip/downloads>.
2. Extract the archive and validate the MMDB before deploying it.
3. Copy it beside the deployed file under a temporary name, then rename it to `GeoIP2-City.mmdb`. Keep the temporary file on the same filesystem so the replacement is atomic. A GeoLite2 City file can use this deployed filename; a Country database requires changing the reader method and is not a drop-in replacement.
4. The next lookup detects the changed file and opens it. No rebuild or restart is required. Existing requests finish with their existing reader. Invalid or missing files produce an unknown country and display the notice rather than granting optional cookies automatically.

Keep the data current in accordance with MaxMind's terms. See <https://support.maxmind.com/knowledge-base/articles/maintain-up-to-date-data>.

## Future footer

`src/components/atoms/cookie-settings-button.tsx` exports `CookieSettingsButton`. Render it anywhere inside the existing providers to reopen settings. It uses the current locale and discards unsaved edits when closed. The component is demonstrated on the existing non-indexable `/ui` gallery; no footer or unrelated navigation item is added.
