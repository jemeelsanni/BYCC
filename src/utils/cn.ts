import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names or class name objects and merges Tailwind CSS classes.
 * Uses clsx to combine class names and twMerge to handle Tailwind utility conflicts.
 * 
 * @param inputs - Class name inputs (strings, objects, arrays)
 * @returns - Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}