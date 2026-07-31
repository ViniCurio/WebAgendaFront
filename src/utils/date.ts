export function formatDateDisplay(dateString: string) {
  return dateString.split('-').reverse().join('/');
}
