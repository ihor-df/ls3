import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);
const NO_INDEX_QUERY_PARAMS = new Set(["_gl", "search", "category", "page"]);

export default function proxy(request: NextRequest) {
  const response = handleI18n(request);
  const url = new URL(response.headers.get("location") ?? request.url);
  const firstPagePath = url.pathname.match(/^((?:\/[^/]+)?\/(?:blog|partners)(?:\/category\/[^/]+)?)\/page\/1$/);

  if (firstPagePath) {
    url.pathname = firstPagePath[1];
    const redirect = NextResponse.redirect(url, 308);

    // Preserve the locale cookie set by next-intl in the new redirect response.
    for (const cookie of response.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }

    return redirect;
  }

  const { pathname, search, searchParams } = request.nextUrl;
  const hasListingQuery = /\/(?:version-history|publications)$/.test(pathname) && Boolean(search);
  const hasNoIndexParam = [...searchParams.keys()].some(
    (key) => key.startsWith("utm_") || NO_INDEX_QUERY_PARAMS.has(key),
  );

  if (hasListingQuery || hasNoIndexParam) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
