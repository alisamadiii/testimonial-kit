import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTestimonial,
  getTestimonials,
  updateTestimonial,
} from "./action";
import { toast } from "sonner";
import { Testimonial, TestimonialInsert } from "./schema";

export const useGetTestimonials = (projectId: string) => {
  return useQuery({
    queryKey: ["testimonials", projectId],
    queryFn: async () => {
      try {
        const { data, error } = await getTestimonials({ projectId });

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

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, name, message }: TestimonialInsert) => {
      const { data, error } = await createTestimonial({
        projectId,
        name,
        message,
      });

      if (error) {
        throw new Error(error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      id,
      status,
      previousStatus,
    }: {
      projectId: string;
      id: string;
      status: Testimonial["status"];
      previousStatus: Testimonial["status"];
    }) => {
      try {
        queryClient.setQueryData(
          ["testimonials", projectId],
          (old: Testimonial[]) => {
            return old.map((testimonial) =>
              testimonial.id === id ? { ...testimonial, status } : testimonial
            );
          }
        );

        const { data, error } = await updateTestimonial({
          projectId,
          id,
          status,
        });

        if (error) {
          throw new Error(error);
        }

        return data;
      } catch (error) {
        console.error(error);
        throw new Error((error as Error).message);
      }
    },
    onError: (error, { projectId, id, previousStatus }) => {
      queryClient.setQueryData(
        ["testimonials", projectId],
        (old: Testimonial[]) => {
          return old.map((testimonial) =>
            testimonial.id === id
              ? { ...testimonial, status: previousStatus }
              : testimonial
          );
        }
      );

      toast.error(error.message);
    },
  });
};
