"use client";

import { useGetTestimonials, useUpdateTestimonial } from "@/db/use-testimonial";
import { Testimonial } from "@/db/schema";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

type Props = {
  slug: string;
};

export default function Testimonials({ slug }: Props) {
  const testimonials = useGetTestimonials(slug);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* <Button onClick={() => insertDummyTestimonials()}>insert</Button> */}

      {testimonials.data?.map((testimonial) => (
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
    <div className="flex justify-between gap-8 rounded-lg border p-4 shadow-sm">
      <div>
        <h3 className="text-lg font-medium">{testimonial.name}</h3>
        <p className="text-sm">{testimonial.message}</p>
        <small className="text-muted-foreground text-xs">
          {format(new Date(testimonial.createdAt), "MMM d, yyyy")}
        </small>
      </div>
      <div className="shrink-0">
        <Switch
          checked={testimonial.status === "approved"}
          onCheckedChange={(checked) =>
            updateTestimonial({
              projectId,
              id: testimonial.id,
              status: checked ? "approved" : "pending",
              previousStatus: testimonial.status,
            })
          }
        />
      </div>
    </div>
  );
}
