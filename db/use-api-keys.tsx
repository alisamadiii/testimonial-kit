import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiKey, deleteApiKey, getApiKeys } from "./action";
import { useGetUser } from "@/auth/useAuth";
import { toast } from "sonner";

export const useGetApiKeys = () => {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      try {
        const { data, message } = await getApiKeys();

        if (!data) {
          throw new Error(message || "Failed to fetch API keys");
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

      const { data, message } = await createApiKey({
        userId: userData.id,
      });

      if (!data) {
        throw new Error(message || "Failed to create API key");
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

      const { data, message } = await deleteApiKey({
        id,
      });

      if (!data) {
        throw new Error(message || "Failed to delete API key");
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
