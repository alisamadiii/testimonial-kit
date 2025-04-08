import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return `t_${Math.random().toString(36).substring(2, 11)}`;
}

export function textToJson(text?: string) {
  try {
    if (!text) {
      return null;
    }

    const jsonString = text
      .replace(/(\w+):/g, '"$1":') // Add quotes around property names
      .replace(/\n/g, "") // Remove newlines
      .replace(/\s+/g, " "); // Normalize whitespace

    return JSON.parse(jsonString);
  } catch (error) {
    console.error(error);
    return null;
  }
}
