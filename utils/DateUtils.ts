export function convertToISO(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    // Ensure leading zeroes and convert year properly
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    const fullYear = year.length === 2 ? `20${year}` : year;
  
    return `${fullYear}-${paddedMonth}-${paddedDay}`; // e.g. "2025-06-27"
}