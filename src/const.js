export const Position = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend'
};

export const POINT_COUNT = 3;

export const groupToPretext = {
  action: 'to',
  place: 'in'
};

export const PointType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

export const COLORS = ['black', 'yellow', 'blue', 'green', 'pink'];


export const createOffer = (id, title, price) => ({
  id,
  title,
  price
});

export const createDestination = (id, name, description, pictures) => ({
  id,
  name,
  description,
  pictures: pictures || []
});

export const createPoint = (id, type, destination, dateFrom, dateTo, basePrice, offers, isFavorite) => ({
  id,
  type,
  destination,
  dateFrom,
  dateTo,
  basePrice,
  offers: offers || [],
  isFavorite: isFavorite || false
});


export const getPrepositionForType = (type) => {
  const movementTypes = [
    PointType.TAXI,
    PointType.BUS,
    PointType.TRAIN,
    PointType.SHIP,
    PointType.DRIVE,
    PointType.FLIGHT
  ];

  return movementTypes.includes(type) ? groupToPretext.action : groupToPretext.place;
};

export const MessageBoard = {
  EMPTY_LIST: 'Click New Event to create your first point'
};

import { isActualPoint, isExpiredPoint, isFuturePoint } from './utils';

const FiltersPoint = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const filter = {
  [FiltersPoint.EVERYTHING]: (points) => points,
  [FiltersPoint.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FiltersPoint.PRESENT]: (points) => points.filter((point) => isActualPoint(point)),
  [FiltersPoint.PAST]: (points) => points.filter((point) => isExpiredPoint(point))
};

export { FiltersPoint, filter };
