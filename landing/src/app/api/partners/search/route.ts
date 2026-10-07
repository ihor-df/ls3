import { getPartnerCategories, getPartnersData } from "@/app/[locale]/partners/data";
import { routing } from "@/i18n/routing";
import { parsePageNumber } from "@/lib/pagination";
import { PARTNERS_SEARCH_MAX_LENGTH } from "@/lib/partners-search";
import { hasLocale } from "next-intl";
import type { NextRequest } from "next/server";

const respond = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, follow" },
  });

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const locale = params.get("locale");
  const query = params.get("q")?.trim();
  const categorySlug = params.get("category");
  const page = parsePageNumber(params.get("page") ?? undefined);

  if (!hasLocale(routing.locales, locale) || !query || query.length > PARTNERS_SEARCH_MAX_LENGTH || page === null) {
    return respond({ error: "invalid_request" }, 400);
  }

  try {
    const category = categorySlug
      ? (await getPartnerCategories(locale)).find(({ slug }) => slug === categorySlug)
      : undefined;

    if (categorySlug && !category) return respond({ error: "category_not_found" }, 404);

    const { partners, total, pageCount } = await getPartnersData(locale, {
      page,
      searchQuery: query,
      categoryId: category?._id,
    });

    return respond({ partners, total, pageCount });
  } catch (error) {
    console.error("Partners search failed", error);
    return respond({ error: "search_unavailable" }, 503);
  }
}
