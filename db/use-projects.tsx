import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getProjects,
  getProjectsById,
} from "./action";
import { useGetUser } from "@/auth/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const { data, error } = await getProjects();

        if (error) {
          throw new Error(error);
        }

        return data;
      } catch (error) {
        console.error(error);
        throw new Error((error as Error).message);
      }
    },
  });
};

export const useGetProjectsById = (id: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      try {
        const { data, error } = await getProjectsById(id);

        if (error) {
          throw new Error(error);
        }

        return data;
      } catch (error) {
        console.error(error);
        throw new Error((error as Error).message);
      }
    },
  });
};

export const useCreateProject = () => {
  const { data: userData } = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!userData) {
        throw new Error("User not found");
      }

      const { data, error } = await createProject({
        userId: userData.id,
        name,
      });

      if (error) {
        throw new Error(error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteProject = () => {
  const { data: userData } = useGetUser();
  const queryClient = useQueryClient();

  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!userData) {
        throw new Error("User not found");
      }

      const { data, error } = await deleteProject({
        id,
      });

      if (error) {
        throw new Error(error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
