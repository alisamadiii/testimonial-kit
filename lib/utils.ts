import { clsx, type ClassValue } from "clsx";
import { parseISO, format } from "date-fns";
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

export function groupByDate(timestamps: string[] | undefined | null) {
  if (!timestamps || !Array.isArray(timestamps) || timestamps.length === 0) {
    return [];
  }

  const dates = timestamps.map((item) => {
    // Parse the UTC date string
    const [datePart, timePart] = item.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    // Create a date object in UTC
    const utcDate = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second)
    );

    // Format the date in local timezone
    return format(utcDate, "yyyy-MM-dd HH:mm:ss");
  });

  const grouped = dates.reduce(
    (acc, timestamp) => {
      const date = format(parseISO(timestamp), "yyyy-MM-dd");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(grouped).map(([date, count]) => ({
    date,
    count,
  }));
}
