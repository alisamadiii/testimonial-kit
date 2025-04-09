import React from "react";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import Content from "@/components/content";
import { db } from "@/db";
import { projects } from "@/db/schema";

import FormTestimonial from "./form";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TestimonialPage({ params }: Props) {
  const { slug } = await params;

  const data = await db
    .select()
    .from(projects)
    .where(eq(projects.id, slug))
    .limit(1)
    .then((res) => res[0]);

  if (!data) {
    return notFound();
  }

  return (
    <Content className="flex max-w-sm flex-col items-center justify-center">
      <FormTestimonial slug={slug} description={data.description} />
    </Content>
  );
}
