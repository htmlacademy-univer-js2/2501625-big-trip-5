import { getRandomInt } from '../utils.js';
import { PointType, createOffer, createPoint } from '../const.js';

const DESTINATION_NAMES = ['Moscow', 'Saratov', 'Kazan', 'Zelenograd'];
const MAX_PHOTOS = 5;
const SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.'
];

const generateDescription = () => {
  const count = getRandomInt(1, SENTENCES.length);
  return Array.from({ length: count }, () => SENTENCES[getRandomInt(0, SENTENCES.length - 1)]).join(' ');
};

const generatePhotos = () => {
  const count = getRandomInt(1, MAX_PHOTOS);
  return Array.from({ length: count }, (_, i) => ({
    src: `https://loremflickr.com/248/152?random=${Math.random()}`,
    description: `Photo ${i + 1} of destination`
  }));
};

export const generateDestinations = () => DESTINATION_NAMES.map((name, index) => ({
  id: `dest-${index}`,
  name,
  description: generateDescription(),
  pictures: generatePhotos()
}));


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

const MAX_OFFER_PRICE = 200;

export const generateOffersByType = () => Object.entries(OFFERS_BY_TYPE).map(([type, offers]) => ({
  type,
  offers: offers.map((title, i) => createOffer(`offer-${type}-${i}`, title, getRandomInt(10, MAX_OFFER_PRICE)))
}));

const MAX_DAYS_GAP = 7;
const MAX_POINT_PRICE = 400;

const generateDate = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + getRandomInt(-MAX_DAYS_GAP, MAX_DAYS_GAP));
  startDate.setHours(getRandomInt(0, 23), getRandomInt(0, 59));

  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + getRandomInt(1, 6));

  return { startDate, endDate };
};

const getRandomArrayItem = (array) => array[getRandomInt(0, array.length - 1)];

export const generatePoints = (count, destinations, offersByType) => Array.from({ length: count }, (_, index) => {
  const type = getRandomArrayItem(Object.values(PointType));
  const { startDate, endDate } = generateDate();

  const destination = getRandomArrayItem(destinations);
  const offersOfType = offersByType.find((offer) => offer.type === type)?.offers ?? [];
  const offersCount = getRandomInt(0, offersOfType.length);
  const selectedOffers = [];
  for(let i = 0; i < offersCount; i++) {
    selectedOffers.push(offersOfType[i]);
  }

  return createPoint(
    `point-${index}`,
    type,
    destination.id, // сохраняем только id
    startDate,
    endDate,
    getRandomInt(20, MAX_POINT_PRICE),
    selectedOffers.map((o) => o.id), // только id офферов
    Math.random() > 0.7
  );
});

