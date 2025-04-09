"use client";

import { format } from "date-fns";
import { ArchiveRestore } from "lucide-react";

import { useGetTestimonials, useUpdateTestimonial } from "@/db/use-testimonial";
import { Testimonial } from "@/db/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Props = {
  slug: string;
};

export default function ArchivePage({ slug }: Props) {
  const testimonials = useGetTestimonials(slug);

  if (testimonials.isPending)
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="aspect-video w-full" />
        ))}
      </div>
    );

  if (testimonials.isError)
    return <div>Error: {testimonials.error.message}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {testimonials.data
        ?.filter((testimonial) => testimonial.status === "archived")
        .map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            projectId={slug}
          />
        ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  projectId,
}: {
  testimonial: Testimonial;
  projectId: string;
}) {
  const { mutate: updateTestimonial } = useUpdateTestimonial();

  return (
    <div className="flex items-start justify-between gap-8 rounded-lg border p-4 shadow-sm">
      <div>
        <h3 className="text-lg font-medium">{testimonial.name}</h3>
        <p className="text-sm">{testimonial.message}</p>
        <small className="text-muted-foreground text-xs">
          {format(new Date(testimonial.createdAt), "MMM d, yyyy")}
        </small>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            updateTestimonial({
              projectId,
              id: testimonial.id,
              status: "pending",
              previousStatus: testimonial.status,
            })
          }
        >
          <ArchiveRestore />
        </Button>
      </div>
    </div>
  );
}
