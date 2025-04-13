"use client";

import React from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignInWithEmail } from "@/auth/useAuth";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Login() {
  const signInWithEmailMutation = useSignInWithEmail();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    signInWithEmailMutation.mutate({
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-8 py-12">
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
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-muted-foreground">
          Enter your credentials to login to your account.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <div></div>
            <Link
              href="/reset-password"
              className={buttonVariants({
                variant: "link",
                className: "!h-auto !px-0 !py-0",
              })}
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Login
          </Button>
        </form>
      </Form>
      <div className="h-12"></div>
    </div>
  );
}
