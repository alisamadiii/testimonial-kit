import { headers } from "next/headers";
import { CheckIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/auth/auth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getSession } from "@/auth/action";

import FirstUser from "@/components/first-user";
import Login from "@/components/login";
import Content from "@/components/content";

import { Badge } from "./ui/badge";

export default async function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const database = process.env.DATABASE_URL;
  const resend = process.env.RESEND_API_KEY;
  const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
  const betterAuthUrl = process.env.BETTER_AUTH_URL;

  if (!database || !resend || !betterAuthSecret || !betterAuthUrl) {
    return (
      <Content>
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl font-bold text-neutral-900">
            Environment Variables
          </h1>
          <p className="text-neutral-600">
            Please set up the following environment variables to continue. These
            are required for the application to function properly.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-md border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-full",
                  database
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                )}
              >
                {database ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <XIcon className="size-4" />
                )}
              </span>
              <div className="flex-1">
                <h2 className="font-medium text-neutral-900">DATABASE_URL</h2>
                <p className="text-sm text-neutral-600">
                  Database connection string for your application
                </p>
              </div>
              <Badge variant={database ? "success" : "destructive"}>
                {database ? "Set" : "Missing"}
              </Badge>
            </div>
          </div>

          <div className="rounded-md border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-full",
                  resend
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                )}
              >
                {resend ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <XIcon className="size-4" />
                )}
              </span>
              <div className="flex-1">
                <h2 className="font-medium text-neutral-900">RESEND_API_KEY</h2>
                <p className="text-sm text-neutral-600">
                  API key for email service integration
                </p>
              </div>
              <Badge variant={resend ? "success" : "destructive"}>
                {resend ? "Set" : "Missing"}
              </Badge>
            </div>
          </div>

          <div className="rounded-md border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-full",
                  betterAuthSecret
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                )}
              >
                {betterAuthSecret ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <XIcon className="size-4" />
                )}
              </span>
              <div className="flex-1">
                <h2 className="font-medium text-neutral-900">
                  BETTER_AUTH_SECRET
                </h2>
                <p className="text-sm text-neutral-600">
                  Secret key for authentication system
                </p>
              </div>
              <Badge variant={betterAuthSecret ? "success" : "destructive"}>
                {betterAuthSecret ? "Set" : "Missing"}
              </Badge>
            </div>
          </div>

          <div className="rounded-md border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-full",
                  betterAuthUrl
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                )}
              >
                {betterAuthUrl ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <XIcon className="size-4" />
                )}
              </span>
              <div className="flex-1">
                <h2 className="font-medium text-neutral-900">
                  BETTER_AUTH_URL
                </h2>
                <p className="text-sm text-neutral-600">
                  Authentication service URL
                </p>
              </div>
              <Badge variant={betterAuthUrl ? "success" : "destructive"}>
                {betterAuthUrl ? "Set" : "Missing"}
              </Badge>
            </div>
          </div>
        </div>
      </Content>
    );
  }

  const users = await db.select().from(user);

  if (users.length === 0) {
    return <FirstUser />;
  }

  const userData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!userData) {
    return <Login />;
  }

  if (userData.user.role !== "admin") {
    return (
      <Content>
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl font-bold text-neutral-900">Access Denied</h1>
          <p className="text-neutral-600">
            You need to manually make your self an admin to continue. Simply go
            to your DB and update your role to "admin".
          </p>
        </div>
      </Content>
    );
  }

  // Initialize QueryClient and prefetch session data
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const value = await getSession();

      if (value.error) {
        throw new Error(value.error.message);
      }

      return value.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
