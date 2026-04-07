import { format, startOfWeek, endOfWeek, isToday, isYesterday } from 'date-fns';

export function formatDate(date) {
  return format(date, 'EEEE, MMMM d');
}

export function formatTime(date) {
  return format(date, 'h:mm a');
}

export function formatWeekRange(weekStart) {
  const start = startOfWeek(weekStart, { weekStartsOn: 1 });
  const end = endOfWeek(weekStart, { weekStartsOn: 1 });
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
}

export function formatDateLabel(dateString) {
  const date = new Date(dateString);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}
