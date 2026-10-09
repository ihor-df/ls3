import { getRevalidationPlan, type WebhookPayload } from "@/sanity/revalidation";
import { parseBody } from "next-sanity/webhook";
import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return Response.json({ error: "Webhook secret is not configured" }, { status: 503 });

  try {
    // parseBody verifies the signature and waits 3 seconds for Content Lake eventual consistency.
    const { body, isValidSignature } = await parseBody<WebhookPayload>(request, secret);
    if (!isValidSignature || !body) return Response.json({ error: "Invalid signature" }, { status: 401 });

    const plan = getRevalidationPlan(body, request.headers.get("sanity-operation"));
    const profile = plan.immediate ? { expire: 0 } : "max";

    for (const tag of plan.tags) revalidateTag(tag, profile);
    for (const path of plan.paths) revalidatePath(path);

    return Response.json({ revalidated: true, ...plan });
  } catch (error) {
    console.error("Sanity revalidation failed", error);
    // A 500 response lets Sanity retry; repeating cache invalidation is safe.
    return Response.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
