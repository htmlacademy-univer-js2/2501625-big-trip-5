import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const DASH = '&mdash;';
const NBSP = '&nbsp;';
const EURO_SYMBOL = '&euro;';

const getRouteTrip = (points, destinations) => {
  if (!points.length) {
    return '';
  }

  const sortedPoints = [...points].sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom));

  const routeWithoutRepeats = [sortedPoints[0].destination];
  for (let i = 1; i < sortedPoints.length; i++) {
    if (sortedPoints[i].destination !== sortedPoints[i - 1].destination) {
      routeWithoutRepeats.push(sortedPoints[i].destination);
    }
  }

  if (routeWithoutRepeats.length > 3) {
    const startPoint = destinations.find((item) => item.id === routeWithoutRepeats[0]);
    const endPoint = destinations.find((item) => item.id === routeWithoutRepeats.at(-1));
    return `${startPoint.name} ${DASH} ... ${DASH} ${endPoint.name}`;
  }

  return routeWithoutRepeats
    .map((destinationId) => destinations.find((item) => item.id === destinationId)?.name || '')
    .join(` ${DASH} `);
};

const getTripDates = (points) => {
  if (!points.length) {
    return '';
  }

  const sortedPoints = [...points].sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom));

  const startDate = dayjs(sortedPoints[0].dateFrom).format('DD MMM');
  const endDate = dayjs(sortedPoints.at(-1).dateTo).format('DD MMM');

  return `${startDate}${NBSP}${DASH}${NBSP}${endDate}`;
};

const getPricePointOffers = (point, offers) => {
  if (!offers.length) {
    return 0;
  }

  const offersByPointType = offers.find((offer) => offer.type === point.type);
  if (!offersByPointType || !offersByPointType.offers) {
    return 0;
  }

  let pricePointOffers = 0;
  const pointOffers = point.offers;
  pointOffers.forEach((offerId) => {
    const offer = offersByPointType.offers.find((item) => item.id === offerId);
    if (offer) {
      pricePointOffers += offer.price;
    }
  });

  return pricePointOffers;
};

const getTotalPriceTrip = (points, offers) => {
  if (!points.length) {
    return '';
  }

  let totalPrice = 0;
  points.forEach((point) => {
    totalPrice += point.basePrice;
    totalPrice += getPricePointOffers(point, offers);
  });

  return `Total: ${EURO_SYMBOL}&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>`;
};

function createTripInfoTemplate(points, destinations, offers) {
  if (!destinations.length || !offers.length) {
    return '';
  }
  return `
    <div class="trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getRouteTrip(points, destinations)}</h1>
        <p class="trip-info__dates">${getTripDates(points)}</p>
      </div>
      <p class="trip-info__cost">
        ${getTotalPriceTrip(points, offers)}
      </p>
    </div>
  `;
}


export default class TripInfoView extends AbstractView {
  #points;
  #destinations;
  #offers;

  constructor(points, destinations, offers) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template () {
    return createTripInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}

