import { Reader } from "@maxmind/geoip2-node";
import { stat } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GeoIPReader = Awaited<ReturnType<typeof Reader.open>>;
let cached: { signature: string; reader: Promise<GeoIPReader> } | undefined;

async function getGeoIPReader(): Promise<GeoIPReader> {
  const databasePath = process.env.GEOIP_DB_PATH || path.join(process.cwd(), "data/geoip/GeoIP2-City.mmdb");
  const file = await stat(databasePath);
  // Reopen after a manual replacement, including an atomic rename on a Docker volume.
  const signature = `${databasePath}:${file.ino}:${file.size}:${file.mtimeMs}:${file.ctimeMs}`;
  if (cached?.signature === signature) return cached.reader;

  const reader = Reader.open(databasePath);
  cached = { signature, reader };
  try {
    return await reader;
  } catch (error) {
    if (cached?.reader === reader) cached = undefined;
    throw error;
  }
}

export async function GET(request: Request) {
  let country: { code: string | null; name: string | null } = { code: null, name: null };
  // The deployment proxy must overwrite these headers with the visitor's IP.
  const configuredHeader = process.env.GEOIP_IP_HEADER;
  const raw = configuredHeader
    ? request.headers.get(configuredHeader)
    : request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for");
  const ip = raw
    ?.split(",")[0]
    ?.trim()
    .replace(/^::ffff:/i, "");

  if (ip) {
    try {
      const reader = await getGeoIPReader();
      const geo = reader.city(ip);
      country = { code: geo.country?.isoCode ?? null, name: geo.country?.names?.en ?? null };
    } catch {
      // Missing files, invalid/private IPs and failed lookups require the notice.
    }
  }

  return Response.json(
    { country },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
