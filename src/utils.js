const render = (container, element, place) => {
  container.insertAdjacentHTML(place, element);
};

const getUpperFirst = (string) => string ? string.charAt(0).toUpperCase() + string.slice(1) : '';

const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getTime = (date) => date.toLocaleTimeString('en-US').slice(0, 5);

const generateId = () => `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export {render, getUpperFirst, getRandomInt, getTime};


export const getRandomArrayElement = (items) =>
  items[Math.floor(Math.random() * items.length)];

export const getRandomDate = (daysOffset = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysOffset));
  return date;
};


import dayjs from 'dayjs';

const isFuturePoint = (point) => dayjs().isBefore(point.dateFrom, 'minute');

const isExpiredPoint = (point) => dayjs(point.dateTo).isValid() && dayjs().isAfter(dayjs(point.dateTo), 'minute');

const isActualPoint = (point) => {
  const now = dayjs();
  const dateFrom = dayjs(point.dateFrom);
  const dateTo = dayjs(point.dateTo);

  return dateTo.isValid() &&
         (now.isSame(dateFrom, 'minute') ||
          now.isAfter(dateFrom, 'minute')) &&
         now.isBefore(dateTo, 'minute');
};

export { isFuturePoint, isExpiredPoint, isActualPoint, generateId };
