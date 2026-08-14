import { ClientPerspective, createClient, StegaConfig, type QueryParams } from "next-sanity";

const SANITY_API_VERSION = "2026-08-13";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
});

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
  stega,
  perspective,
}: {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
  stega?: boolean | StegaConfig;
  perspective?: ClientPerspective;
}) {
  return client.fetch(query, params, {
    perspective,
    stega,
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
