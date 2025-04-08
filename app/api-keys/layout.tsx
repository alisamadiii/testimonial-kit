import React from "react";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getApiKeys } from "@/db/action";

export default async function ApiKeysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data, message } = await getApiKeys();

      if (!data) {
        throw new Error(message || "Failed to fetch API keys");
      }

      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
