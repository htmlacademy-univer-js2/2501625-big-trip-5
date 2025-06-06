import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const renderRouteTrip = (points, destinations) => {
  if (points.length === 0) {
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
    return `${startPoint.name} &mdash; ... &mdash; ${endPoint.name}`;
  }

  return routeWithoutRepeats
    .map((destinationId) => destinations.find((item) => item.id === destinationId)?.name || '')
    .join(' &mdash; ');
};


const renderDatesTrip = (points) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = [...points].sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom));

  const startDate = dayjs(sortedPoints[0].dateFrom).format('DD MMM');
  const endDate = dayjs(sortedPoints.at(-1).dateTo).format('DD MMM');

  return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
};


const getPricePointOffers = (point, offers) => {
  if (offers.length === 0) {
    return 0;
  }
  let pricePointOffers = 0;
  const offersByPointType = offers.find((offer) => offer.type === point.type);
  const pointOffers = point.offers;
  pointOffers.forEach((offer) => {
    pricePointOffers += offersByPointType.offers.find((item) => item.id === offer).price;
  });
  return pricePointOffers;
};

const renderTotalPriceTrip = (points, offers) => {
  if (points.length === 0) {
    return '';
  }
  let totalPrice = 0;
  points.forEach((point) => {
    totalPrice += point.basePrice;
    totalPrice += getPricePointOffers(point, offers);
  });
  return `Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>`;
};

function createTripInfoTemplate(points, destinations, offers){
  if (destinations.length === 0 || offers.length === 0) {
    return '';
  }
  return (`<div class="trip-info"><div class="trip-info__main">
    <h1 class="trip-info__title">${renderRouteTrip(points, destinations)}</h1>
    <p class="trip-info__dates">${renderDatesTrip(points)}</p>
    </div>
    <p class="trip-info__cost">
    ${renderTotalPriceTrip(points, offers)}
    </p>
    </div>`);
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

