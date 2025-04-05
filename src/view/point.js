import { createElement } from '../render.js';
import { getUpperFirst, getTime } from '../utils.js';
import { groupToPretext } from '../const.js';

function createPointTemplate({ type, destination, dateFrom, dateTo, basePrice, offers, isFavorite }) {
  return (
    `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dateFrom.toISOString()}">
                  ${dateFrom.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${getUpperFirst(type)} ${groupToPretext[type]} ${getUpperFirst(destination.name)}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom.toISOString()}">${getTime(dateFrom)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo.toISOString()}">${getTime(dateTo)}</time>
                  </p>
                  <p class="event__duration">30M</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${offers.map((offer) => `<li class="event__offer">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                   </li>`).join('')}
                </ul>
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
            </li>`
  );
}

export default class PointView {
  constructor(point) {
    this.point = point;
    this.element = null;
  }


  _onFavoriteClick(event) {
    event.preventDefault();
    this.point.isFavorite = !this.point.isFavorite;
    this.updateFavoriteButton();
  }


  updateFavoriteButton() {
    const favoriteButton = this.getElement().querySelector('.event__favorite-btn');
    if (this.point.isFavorite) {
      favoriteButton.classList.add('event__favorite-btn--active');
    } else {
      favoriteButton.classList.remove('event__favorite-btn--active');
    }
  }


  setFavoriteClickHandler() {
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._onFavoriteClick.bind(this));
  }

  getTemplate() {
    return createPointTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
