// import AbstractView from '../framework/view/abstract-view.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration.js';
import { formatDuration } from '../utils/date.js';
import he from 'he';

dayjs.extend(durationPlugin);

function createOfferList(selectedOfferIds) {
  if (!Array.isArray(selectedOfferIds)) {
    return '';
  }

  return selectedOfferIds
    .filter((offer) => offer.isSelected === true)
    .map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>
    `)
    .join('');
}

function createPointTemplate(point, destinations) {
  const {basePrice, type, destination, isFavorite, dateFrom, dateTo, offers} = point;

  const destination1 = destinations?.find((d) => d.id === destination.id) ?? null;
  // const pointOffers = offers1?.find((o) => o.type === type)?.offers1 ?? [];


  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);

  const formattedDate = start.format('MMM DD');
  const startTime = start.format('HH:mm');
  const endTime = end.format('HH:mm');
  const duration = formatDuration(start, end);

  const offersTemplate = createOfferList(offers);

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${start.format('YYYY-MM-DD')}">${formattedDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${he.encode(type)} ${destination1 ? he.encode(destination1.name) : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">${offersTemplate}</ul>
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class PointView extends AbstractStatefulView {
  #point = null;
  #destinations = null;
  #offers = null;
  _callback = {};

  constructor({ point, destinations, offers, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this._callback.editClick = onEditClick;
    this._callback.favoriteClick = onFavoriteClick;
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations);
  }

  setHandlers() {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick?.();
  };

  setAborting() {
    const resetElementState = () => {
      this.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.shake(resetElementState);
  }


  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick?.();
  };
}
