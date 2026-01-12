// DateUtils.ts
export function convertToISO(dateStr?: string): string {
  if (!dateStr) return '1970-01-01'; // fallback
  const parts = dateStr.split('/');
  if (parts.length !== 3) return '1970-01-01';
  const [day, month, year] = parts;
  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.padStart(2, '0');
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${paddedMonth}-${paddedDay}`;
}


// NEW: convert 12-hour time to 24-hour
export function to24Hour(timeStr?: string): string {
  if (!timeStr) return '00:00:00';
  const [time, modifier] = timeStr.split(' ');
  if (!time || !modifier) return '00:00:00';

  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:00`;
}


// NEW: combine date + time → ISO string
export function toISODateTime(dateStr?: string, timeStr?: string): string {
  if (!dateStr) dateStr = "1970-01-01";

  // detect if already ISO (YYYY-MM-DD)
  const isoDate =
    /^\d{4}-\d{2}-\d{2}$/.test(dateStr) // already YYYY-MM-DD
      ? dateStr
      : convertToISO(dateStr); // only convert DD/MM/YYYY

  const isoTime = timeStr ? to24Hour(timeStr) : "00:00:00";
  return `${isoDate}T${isoTime}`;
}

export function monthsAgo(months: number): Date {
  const now = new Date();
  const d = new Date(now.getTime());
  d.setMonth(d.getMonth() - months);
  return d;
}

export function isAfter(dateA: Date, dateB: Date): boolean {
  return dateA.getTime() > dateB.getTime();
}

export function formatMonth(key: string) {
  const [year, month] = key.split("-");

  const d = new Date(Number(year), Number(month) - 1);

  return d.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}


