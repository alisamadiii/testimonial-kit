"use client";

import { Button } from "@/components/ui/button";
import { useCreateApiKey } from "@/db/use-api-keys";

export default function CreateApiButton() {
  const createApiKey = useCreateApiKey();

  return (
    <Button
      onClick={() => createApiKey.mutate()}
      disabled={createApiKey.isPending}
      variant="outline"
    >
      {createApiKey.isPending ? "Creating..." : "Create API Key"}
    </Button>
  );
}
