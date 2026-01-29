export function formatTimeLabel(date: string, time: string) {
  const txDate = new Date(`${date}T${time}`);
  const now = new Date();

  const isToday = txDate.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = txDate.toDateString() === yesterday.toDateString();

  if (isToday) {
    return txDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isYesterday) return "Yesterday";

  return txDate.toLocaleDateString();
}
