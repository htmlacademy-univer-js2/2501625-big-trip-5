import { getRandomInt } from '../utils.js';
import { PointType, createOffer, createDestination, createPoint } from '../const.js';

const DESTINATION_NAMES = ['Moscow', 'Saratov', 'Kazan', 'Zelenograd'];
const MAX_PHOTOS = 5;
const MAX_DAYS_GAP = 7;
const MAX_OFFER_PRICE = 200;
const MAX_POINT_PRICE = 400;

const SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.'
];

const OFFERS_BY_TYPE = {
  [PointType.TAXI]: ['Upgrade to comfort', 'Add luggage', 'Order child seat'],
  [PointType.BUS]: ['Choose seats', 'Add meal'],
  [PointType.TRAIN]: ['Book a sleeping car', 'Add breakfast'],
  [PointType.SHIP]: ['Upgrade to cabin', 'Add excursion'],
  [PointType.DRIVE]: ['Rent a GPS', 'Add insurance'],
  [PointType.FLIGHT]: ['Upgrade to business class', 'Add priority boarding'],
  [PointType.CHECK_IN]: ['Late check-out', 'Room upgrade'],
  [PointType.SIGHTSEEING]: ['Private guide', 'Photo session'],
  [PointType.RESTAURANT]: ['Special menu', 'Window table']
};

const getRandomArrayItem = (array) => array[getRandomInt(0, array.length - 1)];

const generateDescription = () => {
  const sentencesCount = getRandomInt(1, SENTENCES.length);
  return Array.from({ length: sentencesCount }, () => getRandomArrayItem(SENTENCES)).join(' ');
};

const generatePhotos = () => {
  const count = getRandomInt(1, MAX_PHOTOS);
  return Array.from({ length: count }, (_, i) => ({
    src: `https://loremflickr.com/248/152?random=${Math.random()}`,
    description: `Photo ${i + 1} of destination`
  }));
};

const generateDate = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + getRandomInt(-MAX_DAYS_GAP, MAX_DAYS_GAP));
  startDate.setHours(getRandomInt(0, 23), getRandomInt(0, 59));

  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + getRandomInt(1, 6));

  return { startDate, endDate };
};

const generateOffers = (type) => {
  const availableOffers = OFFERS_BY_TYPE[type] || [];
  const offersCount = getRandomInt(0, availableOffers.length);

  return Array.from({ length: offersCount }, (_, i) => {
    const offerTitle = availableOffers[i];
    return createOffer(
      `offer-${type}-${i}`,
      offerTitle,
      getRandomInt(10, MAX_OFFER_PRICE)
    );
  });
};

let lastId = 0;

const generatePoint = () => {
  const type = getRandomArrayItem(Object.values(PointType));
  const { startDate, endDate } = generateDate();

  const destination = createDestination(
    `dest-${lastId}`,
    getRandomArrayItem(DESTINATION_NAMES),
    generateDescription(),
    generatePhotos()
  );

  return createPoint(
    `point-${lastId++}`,
    type,
    destination,
    startDate,
    endDate,
    getRandomInt(20, MAX_POINT_PRICE),
    generateOffers(type),
    Math.random() > 0.7
  );
};

export const generatePoints = (count) => Array.from({ length: count }, generatePoint);

