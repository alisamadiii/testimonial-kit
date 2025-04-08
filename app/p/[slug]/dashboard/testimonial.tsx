"use client";

import { useGetTestimonials, useUpdateTestimonial } from "@/db/use-testimonial";
import { Testimonial } from "@/db/schema";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { insertTestimonials } from "@/db/action";

type Props = {
  slug: string;
};

export default function Testimonials({ slug }: Props) {
  const testimonials = useGetTestimonials(slug);

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => insertTestimonials()}>insert</Button>

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
    <div className="flex gap-8 rounded-lg border p-4 shadow-sm">
      <div>
        <h3 className="text-lg font-medium">{testimonial.name}</h3>
        <p className="text-sm">{testimonial.message}</p>
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
