import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

import { db } from "@/db";
import { apiKeys, projects, testimonials } from "@/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 401 });
  }

  // Single query to validate API key, project, and fetch testimonials
  const result = await db
    .select({
      testimonials: testimonials,
    })
    .from(testimonials)
    .innerJoin(projects, eq(projects.id, testimonials.projectId))
    .innerJoin(apiKeys, eq(apiKeys.key, apiKey))
    .where(
      and(eq(testimonials.projectId, slug), eq(testimonials.status, "approved"))
    );

  if (result.length === 0) {
    // Check if it's an auth error or not found error
    const [validApiKey] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.key, apiKey))
      .limit(1);

    if (!validApiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "No approved testimonials found for this project" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    result.map((r) => r.testimonials),
    { status: 200 }
  );
}
