import { format } from 'date-fns';

/**
 * Formats a date to a standard format for e-commerce sites.
 * The default format is "MMM dd, yyyy" (e.g., "Aug 24, 2025").
 *
 * @param date - The date to format. Can be a Date object, string, or number.
 * @param dateFormat - (Optional) Custom format string to use.
 * @returns The formatted date string, or a fallback string if the date is invalid.
 */
export const formatDate = (
  date: Date | string | number,
  dateFormat: string = 'MMM dd, yyyy',
): string => {
  const parsedDate = new Date(date);
  // If the date is invalid, return a fallback (e.g., an empty string or a placeholder)
  if (isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }
  return format(parsedDate, dateFormat);
};
