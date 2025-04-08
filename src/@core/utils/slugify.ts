export function slugify(text: string | undefined | null): string {
  if (text == null || typeof text !== 'string') {
    console.warn('slugify received invalid input:', text);
    return '';
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and') // Replace '&' with 'and'
    .replace(/[']/g, '') // Remove apostrophes
    .replace(/[,]/g, '') // Remove commas
    .replace(/[^\w\s-]/g, '') // Remove non-word characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Trim leading or trailing hyphens
}
