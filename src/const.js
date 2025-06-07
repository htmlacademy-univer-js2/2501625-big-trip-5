export const COLORS = ['black', 'yellow', 'blue', 'green', 'pink'];

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const MessageBoard = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
  LOAD_ERROR: 'Failed to load latest route information'
};

export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing'
};

export const POINT_COUNT = 3;

export const PointAction = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  DELETE: 'DELETE'
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

export const PointTypeDescription = {
  [PointType.BUS]: 'Bus',
  [PointType.SHIP]: 'Ship',
  [PointType.RESTAURANT]: 'Restaurant',
  [PointType.TAXI]: 'Taxi',
  [PointType.DRIVE]: 'Drive',
  [PointType.FLIGHT]: 'Flight',
  [PointType.TRAIN]: 'Train',
  [PointType.CHECK_IN]: 'Check-in',
  [PointType.SIGHTSEEING]: 'Sightseeing'
};

export const Position = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend'
};

export const Selectors = {
  ADD_BUTTON: '.trip-main__event-add-btn',
  TRIP_MAIN: '.trip-main',
};

export const ServerKeys = {
  BASE_PRICE: 'base_price',
  DATE_FROM: 'date_from',
  DATE_TO: 'date_to',
  IS_FAVORITE: 'is_favorite',
};


export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'init',
  LOADING: 'loading',
  ERROR: 'error',
};
