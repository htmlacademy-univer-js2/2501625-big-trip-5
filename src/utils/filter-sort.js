import { FilterType, SortType } from '../const.js';
import dayjs from 'dayjs'; // если ты его используешь

export const filterPoints = {
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


function sortDay(DayA, DayB){
  return dayjs(DayA.startTime).diff(dayjs(DayB.startTime));
}

function sortTime(timeA, timeB){
  const timeDif1 = dayjs(timeA.finishTime).diff(dayjs(timeA.startTime));
  const timeDif2 = dayjs(timeB.finishTime).diff(dayjs(timeB.startTime));

  return timeDif2 - timeDif1;
}

function sortPrice(priceA, priceB) {
  return priceB.price - priceA.price;
}

export const sortPoints = {
  [SortType.DAY]: (points) => [...points].sort(sortDay),
  [SortType.PRICE]: (points) => [...points].sort(sortPrice),
  [SortType.TIME]: (points) => [...points].sort(sortTime),
};
