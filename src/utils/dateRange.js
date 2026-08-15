export function dateRangeFromDays(days) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - parseInt(days, 10));
  return { start_date: start.toISOString(), end_date: end.toISOString() };
}
