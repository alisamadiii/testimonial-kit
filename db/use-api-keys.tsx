import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiKey, deleteApiKey, getApiKeys } from "./action";
import { useGetUser } from "@/auth/useAuth";
import { toast } from "sonner";
import { ApiKey } from "./schema";

export const useGetApiKeys = () => {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      try {
        const { data, error } = await getApiKeys();

        if (error) {
          throw new Error(error);
        }

        return data;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch API keys");
      }
    },
  });
};

export const useCreateApiKey = () => {
  const { data: userData } = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!userData) {
        throw new Error("User not found");
      }

      const { data, error } = await createApiKey({
        userId: userData.id,
      });

      if (error) {
        throw new Error(error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteApiKey = () => {
  const { data: userData } = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      if (!userData) {
        throw new Error("User not found");
      }

      const { data, error } = await deleteApiKey({
        id,
      });

      if (error) {
        throw new Error(error);
      }

      return data;
    },
    onMutate: ({ id }) => {
      const snapshot = queryClient.getQueryData(["api-keys"]);

      queryClient.setQueryData(["api-keys"], (old: ApiKey[]) => {
        return old.filter((apiKey) => apiKey.id !== id);
      });

      return () => queryClient.setQueryData(["api-keys"], snapshot);
    },
    onError: (error, _, rollback) => {
      // How to revert the query data to the previous state?
      rollback?.();

      toast.error(error.message);
    },
  });
};
