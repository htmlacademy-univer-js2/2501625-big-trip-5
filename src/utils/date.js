// utils/date.js
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration.js';
dayjs.extend(durationPlugin);

export function formatDuration(start, end) {
  const diff = dayjs(end).diff(dayjs(start));
  const dur = dayjs.duration(diff);

  const days = dur.days();
  const hours = dur.hours();
  const minutes = dur.minutes();

  const parts = [];
  if (days) {
    parts.push(`${days}D`);
  }
  if (hours) {
    parts.push(`${hours}H`);
  }
  if (minutes) {
    parts.push(`${minutes}M`);
  }

  return parts.join(' ') || '0M';
}
