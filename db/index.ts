import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { TestimonialInsert, testimonials } from "./schema";

export const db = drizzle(process.env.DATABASE_URL as string);

// insertTestimonials();
