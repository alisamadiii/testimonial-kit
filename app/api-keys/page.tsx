"use client";

import Content from "@/components/content";
import {
  useGetApiKeys,
  useCreateApiKey,
  useDeleteApiKey,
} from "@/db/use-api-keys";
import { Button } from "@/components/ui/button";
import { ApiKey } from "@/db/schema";

export default function ApiKeysPage() {
  const { data: apiKeys } = useGetApiKeys();
  const createApiKey = useCreateApiKey();

  return (
    <Content>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create your API keys!</h1>
          <p className="text-sm">
            You can create your API keys by clicking the button below.
          </p>
        </div>

        <Button
          onClick={() => createApiKey.mutate()}
          disabled={createApiKey.isPending}
        >
          {createApiKey.isPending ? "Creating..." : "Create API Key"}
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {apiKeys &&
          apiKeys?.map((apiKey) => (
            <ApiKeyCard key={apiKey.id} apiKey={apiKey} />
          ))}
      </div>
    </Content>
  );
}

const ApiKeyCard = ({ apiKey }: { apiKey: ApiKey }) => {
  const deleteApiKey = useDeleteApiKey();

  return (
    <div className="flex items-center gap-2 rounded-lg border p-2">
      <p>{apiKey.name}</p>
      <p className="text-muted-foreground text-sm">{apiKey.key}</p>
      <Button
        onClick={() => deleteApiKey.mutate({ id: apiKey.id })}
        disabled={deleteApiKey.isPending}
        className="ml-auto"
        variant="destructive"
      >
        {deleteApiKey.isPending ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};
