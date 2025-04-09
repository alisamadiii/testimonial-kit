"use server";

import { db } from "@/db";
import {
  type ApiKey,
  type Project,
  ApiKeyInsert,
  apiKeys,
  projects,
  Testimonial,
  TestimonialInsert,
  testimonials,
  analytics,
} from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { faker } from "@faker-js/faker";

export const getApiKeys = async (): Promise<ServerResponse<ApiKey[]>> => {
  try {
    const data = await db.select().from(apiKeys);

    console.log("getting api keys 🌆🌆🌆🌆🌆🌆🌆");

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch API keys" };
  }
};

export const createApiKey = async ({
  userId,
}: {
  userId: string;
}): Promise<ServerResponse<ApiKeyInsert>> => {
  try {
    const data = await db
      .insert(apiKeys)
      .values({
        key: `testimonial_${Buffer.from(
          require("crypto").randomBytes(32)
        ).toString("base64")}`,
        name: "API Key",
        status: "active",
        userId,
      })
      .returning()
      .then((res) => res[0]);

    return { data };
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message || "Failed to create API key" };
  }
};

export const deleteApiKey = async ({
  id,
}: {
  id: number;
}): Promise<ServerResponse<string>> => {
  try {
    await db.delete(apiKeys).where(eq(apiKeys.id, id));
    return { data: "API key deleted" };
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message || "Failed to delete API key" };
  }
};

// projects
export const getProjects = async (): Promise<ServerResponse<Project[]>> => {
  try {
    const data = await db
      .select({
        project: projects,
        analytics: analytics,
      })
      .from(projects)
      .leftJoin(analytics, eq(projects.id, analytics.projectId))
      .orderBy(desc(projects.createdAt));

    return {
      data: data.map(({ project, analytics }) => ({
        ...project,
        analytics: analytics || {
          projectId: project.id,
          totalTestimonials: 0,
          totalTestimonialsApproved: 0,
          totalViews: 0,
          dateTestimonials: [],
        },
      })),
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch projects" };
  }
};

export const getProjectsById = async (
  id: string
): Promise<ServerResponse<Project>> => {
  try {
    const data = await db
      .select({
        project: projects,
        analytics: analytics,
      })
      .from(projects)
      .leftJoin(analytics, eq(projects.id, analytics.projectId))
      .where(eq(projects.id, id))
      .limit(1)
      .then((res) => res[0]);

    if (!data) {
      return { error: "Project not found" };
    }

    return {
      data: {
        ...data.project,
        analytics: data.analytics || {
          projectId: data.project.id,
          totalTestimonials: 0,
          totalTestimonialsApproved: 0,
          totalViews: 0,
          dateTestimonials: [],
        },
      },
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch project" };
  }
};

export const createProject = async ({
  userId,
  name,
}: {
  userId: string;
  name: string;
}): Promise<ServerResponse<string>> => {
  try {
    await db.insert(projects).values({
      name,
      userId,
    });

    return { data: "Project created" };
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message || "Failed to create project" };
  }
};

export const deleteProject = async ({
  id,
}: {
  id: string;
}): Promise<ServerResponse<string>> => {
  try {
    await db.delete(projects).where(eq(projects.id, id));

    return { data: "Project deleted" };
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message || "Failed to delete project" };
  }
};

// testimonials
export const getTestimonials = async ({
  projectId,
}: {
  projectId: string;
}): Promise<ServerResponse<Testimonial[]>> => {
  try {
    const data = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.projectId, projectId))
      .orderBy(desc(testimonials.createdAt));

    console.log("gettin testimonials 😏");

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch testimonials" };
  }
};

export const createTestimonial = async ({
  projectId,
  name,
  message,
}: TestimonialInsert): Promise<ServerResponse<string>> => {
  try {
    await db.insert(testimonials).values({
      projectId,
      name,
      message,
    });

    return { data: "Testimonial created" };
  } catch (error) {
    console.error(error);
    return {
      error: (error as Error).message || "Failed to create testimonial",
    };
  }
};

export const updateTestimonial = async ({
  projectId,
  id,
  status,
}: {
  projectId: string;
  id: string;
  status: Testimonial["status"];
}): Promise<ServerResponse<string>> => {
  try {
    await db
      .update(testimonials)
      .set({ status })
      .where(
        and(eq(testimonials.id, id), eq(testimonials.projectId, projectId))
      );

    return { data: "Testimonial updated" };
  } catch (error) {
    console.error(error);
    return {
      error: (error as Error).message || "Failed to update testimonial",
    };
  }
};

export const insertDummyTestimonials = async () => {
  await db.insert(testimonials).values(
    Array.from({ length: 100 }, () => ({
      projectId: "QIRpyPa5uOf",
      name: faker.person.fullName(),
      message: faker.lorem.paragraph(),
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 40) * 24 * 60 * 60 * 1000
      ),
    }))
  );
};
