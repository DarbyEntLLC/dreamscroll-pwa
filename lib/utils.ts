export function formatDate(date: string): string {
  // formatting logic
  return new Date(date).toLocaleDateString();
}