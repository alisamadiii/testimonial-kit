"use client";

import { Button } from "@/components/ui/button";

export default function FetchButton() {
  return (
    <Button
      onClick={async () => {
        const response = await fetch(
          "https://testimonial.alisamadii.com/api/testimonials/xQBDi_KU67b",
          {
            headers: {
              "x-api-key":
                "testimonial_FQyIGrbC9dGlqZAoY05SobIyykwfzrGj4pyTMck0BdA=",
            },
          }
        );

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
