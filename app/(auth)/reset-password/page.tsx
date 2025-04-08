"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeftIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/auth/useAuth";

const formSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    confirmPassword: z.string().min(8).optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}

function Content() {
  const resetPassword = useResetPassword();

  const token = useSearchParams().get("token");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: !token ? "" : "backup@testing.com",
      password: !token ? "testing123" : "",
      confirmPassword: !token ? "testing123" : "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (token) {
      if (!values.password || !values.confirmPassword) {
        toast.error("Passwords are required");
        return;
      }

      resetPassword.mutate({
        password: values.password,
      });
    } else {
      if (!values.email) {
        toast.error("Email is required");
        return;
      }

      resetPassword.mutate({
        email: values.email,
      });
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-8 py-12">
      <div className="absolute top-4 left-1/2 w-full max-w-4xl -translate-x-1/2 px-2 md:top-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon />
          Go back
        </Button>
      </div>
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-full border"
        aria-hidden="true"
      >
        <svg
          className="stroke-zinc-800 dark:stroke-zinc-100"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
        </svg>
      </div>
      <div className="mt-4 mb-8 flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold">Reset password</h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          {!token ? (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="hi@yourcompany.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button disabled={form.formState.isSubmitting}>
            {token ? "Reset password" : "Send password reset instructions"}
          </Button>
        </form>
      </Form>
      <div className="h-12"></div>
    </div>
  );
}
