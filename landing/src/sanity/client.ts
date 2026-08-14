import { createClient } from "next-sanity";

const SANITY_API_VERSION = "2026-08-13";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
});
