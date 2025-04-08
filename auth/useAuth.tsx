import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type { APIError } from "better-auth";
import { toast } from "sonner";

import { authClient, signIn, signOut, signUp } from "@/auth/auth-client";
import { revalidate } from "@/lib/action";
import { getSession } from "./action";

export function useGetUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const value = await getSession();

        if (value.error) {
          throw new Error(value.error.message);
        }

        return value.data;
      } catch (error) {
        const err = error as APIError;
        throw new Error(err.message || "Failed to fetch user");
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const { data, error } = await signOut();

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } catch (error) {
        const err = error as APIError;
        throw new Error(err.message || "Failed to sign out");
      }
    },
    onSuccess: () => {
      router.push("/login");
      queryClient.setQueryData(["user"], null);
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useResetPassword() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  return useMutation({
    mutationFn: async ({
      password,
      email,
    }: {
      password?: string;
      email?: string;
    }) => {
      if (password) {
        if (!token) {
          throw new Error("Token is required");
        }

        const { error } = await authClient.resetPassword({
          newPassword: password,
          token,
        });

        if (error) {
          throw new Error(error.message);
        }

        return true;
      }

      if (email) {
        const { error } = await authClient.forgetPassword({
          email,
          redirectTo: `/reset-password`,
        });

        if (error) {
          throw new Error(error.message);
        }

        return true;
      }
    },
    onSuccess: (_, { email }) => {
      if (email) {
        toast.success("Password reset instructions sent");
      } else {
        toast.success("Password reset successfully");
        router.push("/login");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useSignUpWithEmail() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      try {
        const { data, error } = await signUp.email({
          email,
          password,
          name,
        });

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } catch (error) {
        const err = error as APIError;
        throw new Error(err.message || "Failed to sign up with email");
      }
    },
    onSuccess: () => {
      router.push("/");
      revalidate("/");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useSignInWithEmail() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      try {
        const { data, error } = await signIn.email({ email, password });

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } catch (error) {
        const err = error as APIError;
        throw new Error(err.message || "Failed to sign in with email");
      }
    },
    onSuccess: () => {
      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useSignInWithGoogle() {
  return useMutation({
    mutationFn: async () => {
      try {
        const { data, error } = await signIn.social({
          provider: "google",
          callbackURL: `${window.location.origin}/`,
        });

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } catch (error) {
        const err = error as APIError;
        throw new Error(err.message || "Failed to sign in with google");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.deleteUser({
        callbackURL: `/goodbye`,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      router.push("/login");
      queryClient.setQueryData(["user"], null);
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
