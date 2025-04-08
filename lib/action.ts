"use server";

import { auth } from "@/auth/auth";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createTask(title: string) {
  await db.insert(tasksTable).values({ title });
}

export async function getTasks() {
  return await db.select().from(tasksTable);
}

export async function deleteTask(id: number) {
  await db.delete(tasksTable).where(eq(tasksTable.id, id));
}

export async function updateTask(id: number, title: string) {
  await db.update(tasksTable).set({ title }).where(eq(tasksTable.id, id));
}

export async function revalidate(path: string) {
  revalidatePath(path);
}
