"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { type APIError } from "better-auth";

export async function getSession(): Promise<{
  data?: UserData;
  error?: APIError;
}> {
  try {
    const data = await auth.api.getSession({
      headers: await headers(),
    });

    if (!data) {
      throw new Error("No data");
    }

    const user: UserData = {
      id: data.user.id,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      createdAt: data.user.createdAt,
      updatedAt: data.user.updatedAt,
      name: data.user.name,
      image: data.user.image,
    };

    console.log("getSession 🔥🔥🔥🔥🔥🔥🔥🔥");
    return { data: user };
  } catch (error) {
    const err = error as APIError;
    return { error: err };
  }
}
