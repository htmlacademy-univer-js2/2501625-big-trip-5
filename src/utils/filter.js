import { FilterType } from '../const.js';
import dayjs from 'dayjs'; // если ты его используешь

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) =>
    points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs())),
  [FilterType.PRESENT]: (points) =>
    points.filter((point) =>
      dayjs().isAfter(dayjs(point.dateFrom)) && dayjs().isBefore(dayjs(point.dateTo))
    ),
  [FilterType.PAST]: (points) =>
    points.filter((point) => dayjs(point.dateTo).isBefore(dayjs())),
};
