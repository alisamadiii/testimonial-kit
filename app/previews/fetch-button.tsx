"use client";

import { Button } from "@/components/ui/button";

export default function FetchButton() {
  return (
    <Button
      onClick={async () => {
        const response = await fetch("/api/testimonials/YIYTXSlcely", {
          headers: {
            "x-api-key":
              "testimonial_JeCEKamoudhOV2tmgleZnNARSWSM+B7dsynvhi8MG5g=",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        console.log(data);
      }}
    >
      FetchButton
    </Button>
  );
}
