import { createClient, type ClientPerspective, type QueryParams, type StegaConfig } from "next-sanity";

const SANITY_API_VERSION = "2026-08-13";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
});

export async function sanityFetch<Result = unknown, const QueryString extends string = string>({
  query,
  params = {},
  tags = [],
  stega,
  perspective = "published",
}: {
  query: QueryString;
  params?: QueryParams;
  tags?: string[];
  stega?: boolean | StegaConfig;
  perspective?: ClientPerspective;
}) {
  return client.fetch<Result, QueryParams, QueryString>(query, params, {
    perspective,
    stega,
    // Read directly from Content Lake during builds; use CDN at runtime.
    useCdn: process.env.NEXT_PHASE !== "phase-production-build",
    // Do not persist a stale CDN response (including null) after webhook invalidation.
    cacheMode: "noStale",
    next: {
      revalidate: false,
      tags,
    },
  });
}
