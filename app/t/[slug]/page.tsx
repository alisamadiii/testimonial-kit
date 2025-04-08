import React from "react";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import Content from "@/components/content";
import { db } from "@/db";
import { ProjectField, projects } from "@/db/schema";
import { textToJson } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
