import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isHebrewText(text: string): boolean {
  // Hebrew Unicode range: \u0590-\u05FF
  const hebrewPattern = /[\u0590-\u05FF]/;
  // Check if the first non-whitespace character is Hebrew
  const firstChar = text.trim().charAt(0);
  return hebrewPattern.test(firstChar);
}
