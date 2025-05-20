// import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createEditRoutePointTemplate({ type, destination, dateFrom, dateTo, basePrice, offers }) {
  const formattedDateFrom = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const formattedDateTo = dayjs(dateTo).format('DD/MM/YY HH:mm');

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="taxi" ${type === 'taxi' ? 'checked' : ''}>
                  <label class="event__type-label event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="bus" ${type === 'bus' ? 'checked' : ''}>
                  <label class="event__type-label event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="train" ${type === 'train' ? 'checked' : ''}>
                  <label class="event__type-label event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="ship" ${type === 'ship' ? 'checked' : ''}>
                  <label class="event__type-label event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="drive" ${type === 'drive' ? 'checked' : ''}>
                  <label class="event__type-label event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="flight" ${type === 'flight' ? 'checked' : ''}>
                  <label class="event__type-label event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="check-in" ${type === 'check-in' ? 'checked' : ''}>
                  <label class="event__type-label event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === 'sightseeing' ? 'checked' : ''}>
                  <label class="event__type-label event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="restaurant" ${type === 'restaurant' ? 'checked' : ''}>
                  <label class="event__type-label event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">${destination.name}</label>
            <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formattedDateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formattedDateTo}">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offers.map((offer) => `
                <div class="event__offer-selector">
                  <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${offer.isSelected ? 'checked' : ''}>
                  <label class="event__offer-label" for="event-offer-${offer.id}-1">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                  </label>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
          </section>
        </section>
      </form>
    </li>`
  );
}

export default class EditRoutePointView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleCloseClick = null;
  #flatpickrStart = null;
  #flatpickrEnd = null;

  constructor({ point, onFormSubmit, onCloseClick }) {
    super();
    this._state = EditRoutePointView.parsePointToState(point);
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
  }

  get template() {
    return createEditRoutePointTemplate(this._state);
  }

  _initFlatpickr() {
    if (this.#flatpickrStart) {
      this.#flatpickrStart.destroy();
      this.#flatpickrStart = null;
    }
    if (this.#flatpickrEnd) {
      this.#flatpickrEnd.destroy();
      this.#flatpickrEnd = null;
    }

    const startInput = this.element.querySelector('#event-start-time-1');
    const endInput = this.element.querySelector('#event-end-time-1');

    this.#flatpickrStart = flatpickr(startInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: this.#startDateChangeHandler,
    });

    this.#flatpickrEnd = flatpickr(endInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo,
      minDate: this._state.dateFrom, // дата окончания не может быть меньше даты начала
      onChange: this.#endDateChangeHandler,
    });
  }


  _restoreHandlers() {
    this.#setInnerHandlers();
    this._initFlatpickr();

    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    rollupBtn.addEventListener('click', this.#closeClickHandler);

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  #startDateChangeHandler = ([selectedDate]) => {
    const newDateFrom = dayjs(selectedDate).toISOString();
    let newDateTo = this._state.dateTo;

    // Если новая дата начала позже текущей даты окончания, поднимаем дату окончания
    if (dayjs(newDateFrom).isAfter(dayjs(newDateTo))) {
      newDateTo = newDateFrom;
    }

    this._setState({
      dateFrom: newDateFrom,
      dateTo: newDateTo,
    });

    // Обновим minDate у окончания
    this.#flatpickrEnd.set('minDate', newDateFrom);
  };

  #endDateChangeHandler = ([selectedDate]) => {
    const newDateTo = dayjs(selectedDate).toISOString();

    if (dayjs(newDateTo).isBefore(dayjs(this._state.dateFrom))) {
    // Игнорируем или принудительно ставим дату окончания не меньше даты начала
      this._setState({ dateTo: this._state.dateFrom });
    } else {
      this._setState({ dateTo: newDateTo });
    }
  };


  #setInnerHandlers() {
    this.element.querySelectorAll('.event__type-input')
      .forEach((input) => input.addEventListener('change', this.#typeChangeHandler));
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditRoutePointView.parseStateToPoint(this._state));
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };


  #typeChangeHandler = (evt) => {
    this._setState({ type: evt.target.value });
  };

  #destinationChangeHandler = (evt) => {
    this._setState({
      destination: {
        ...this._state.destination,
        name: evt.target.value
      }
    });
  };

  static parsePointToState(point) {
    return { ...point };
  }

  static parseStateToPoint(state) {
    return { ...state };
  }
}
