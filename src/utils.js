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

export {render, getUpperFirst, getRandomInt, getTime};


export const getRandomArrayElement = (items) =>
  items[Math.floor(Math.random() * items.length)];

export const getRandomDate = (daysOffset = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysOffset));
  return date;
};
