export function normalizeSms(message: string): string {
  return message
    .replace(/,/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+\./g, '.')
    .trim();
}

export function extractDateTimeFromMeta(timestamp: number) {
  const d = new Date(timestamp);

  return {
    date: d.toISOString().split("T")[0],
    time: d.toLocaleTimeString("en-KE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toUpperCase(),
  };
}

export function parseNumber(value?: string): number {
  return value ? parseFloat(value.replace(/,/g, "")) : 0;
}