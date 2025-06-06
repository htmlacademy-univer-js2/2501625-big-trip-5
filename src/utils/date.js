import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration.js';
dayjs.extend(durationPlugin);

function padNumber(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

export function formatDuration(start, end) {
  const diffMs = dayjs(end).diff(dayjs(start));

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const dur = dayjs.duration(diffMs);

  const hours = dur.hours();
  const minutes = dur.minutes();

  const parts = [];
  if (totalDays) {
    parts.push(`${padNumber(totalDays)}d`);
  }
  parts.push(`${padNumber(hours)}h`);
  parts.push(`${padNumber(minutes)}m`);

  return parts.join(' ');
}
