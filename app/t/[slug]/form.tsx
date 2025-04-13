"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Portal } from "@radix-ui/react-portal";
import { User } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { useCreateTestimonial } from "@/db/use-testimonial";
import type { ProjectSelect } from "@/db/schema";
import { useGetUser, useSignInWithProvider } from "@/auth/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Login from "@/components/login";
import Content from "@/components/content";
import { usePathname } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(4),
  message: z.string().min(10),
});

export default function FormTestimonial({
  slug,
  project,
}: {
  slug: string;
  project: ProjectSelect;
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const signInWithProvider = useSignInWithProvider();
  const { data: user } = useGetUser();

  const pathname = usePathname();

  const submitTestimonial = useCreateTestimonial();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    submitTestimonial.mutate(
      {
        projectId: slug,
        name: values.name,
        message: values.message,
        avatar: user?.image,
      },
      {
        onSuccess: async () => {
          form.reset();
          setIsSuccess(true);
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
          });
        },
      }
    );
  }

  if (!user && !pathname.includes("t")) {
    return <Login />;
  }

  if (user?.role !== "admin" && !pathname.includes("t")) {
    return (
      <Content>
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl font-bold text-neutral-900">Access Denied</h1>
          <p className="text-neutral-600">
            You need to manually make your self an admin to continue. Simply go
            to your DB and update your role to &quot;admin&quot;.
          </p>
        </div>
      </Content>
    );
  }

  return (
    <>
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
        <h2 className="text-2xl font-bold">Submit a testimonial</h2>
        <p className="text-muted-foreground">{project.description}</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter your message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting || (project.authsEnabled && !user)
            }
          >
            Submit
          </Button>

          {project.authsEnabled && !user && (
            <div className="flex flex-col gap-2">
              <h3>You must be logged in to submit a testimonial</h3>
              <div className="flex gap-2">
                {project.auths?.map((auth) => (
                  <Button
                    variant="outline"
                    type="button"
                    key={auth}
                    onClick={() =>
                      signInWithProvider.mutate({ provider: auth })
                    }
                  >
                    {auth}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="h-30"></div>
        </form>
      </Form>

      {isSuccess && (
        <Portal className="fixed top-0 left-0 isolate z-40 flex h-full w-full items-center justify-center">
          <div
            className="absolute inset-0 -z-10 bg-black/50"
            onClick={() => {
              setIsSuccess(false);
            }}
          ></div>
          <div className="bg-background flex min-h-64 w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl px-8 py-4 text-center">
            <h1 className="text-2xl font-bold">
              Thank you for your testimonial!
            </h1>
            <p className="text-muted-foreground">
              We will review your testimonial and it will be published on the
              website.
            </p>
            <Button variant="outline" onClick={() => setIsSuccess(false)}>
              Close
            </Button>
          </div>
        </Portal>
      )}

      {user && (
        <div className="fixed top-4 left-4 flex flex-col gap-2">
          <Avatar>
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </>
  );
}
