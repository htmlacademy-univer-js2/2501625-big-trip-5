import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { PointType, PointTypeDescription } from '../const.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const renderDestinationPictures = (pictures) =>
  pictures?.length ? pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
  ).join('') : '';

const renderOffers = (allOffers, checkedOffers, isDisabled) => allOffers.map((offer) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden"
           id="event-offer-${offer.id}"
           type="checkbox"
           name="event-offer-${offer.id}"
           ${offer.isSelected ? 'checked' : ''}
           ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>
`).join('');

const renderOffersContainer = (allOffers, checkedOffers, isDisabled) => !allOffers || allOffers.offers.length === 0 ? '' :
  `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
  ${renderOffers(
    allOffers.offers.map((offer) => ({
      ...offer,
      isSelected: checkedOffers.includes(offer.id)
    })),
    checkedOffers,
    isDisabled
  )}

  </div>
  </section>`;

const renderDestinationNames = (destinations) =>
  destinations?.map((dest) => `<option value="${he.encode(dest.name)}"></option>`).join('') || '';

const renderDestinationContainer = (destination) => {
  if (!destination) {
    return '';
  }

  const hasDescription = destination.description?.trim();
  const hasPictures = Array.isArray(destination.pictures) && destination.pictures.length > 0;

  // Если нет ни описания, ни фото — ничего не рендерим
  if (!hasDescription && !hasPictures) {
    return '';
  }

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      ${hasDescription ? `<p class="event__destination-description">${destination.description}</p>` : ''}
      ${hasPictures ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${renderDestinationPictures(destination.pictures)}
          </div>
        </div>` : ''}
    </section>`;
};


const renderEditPointDateTemplate = (dateFrom, dateTo, isDisabled) => `
  <div class="event__field-group event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input event__input--time"
           id="event-start-time-1"
           type="text"
           name="event-start-time"
           value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}"
           ${isDisabled ? 'disabled' : ''}>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input event__input--time"
           id="event-end-time-1"
           type="text"
           name="event-end-time"
           value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}"
           ${isDisabled ? 'disabled' : ''}>
  </div>`;

const renderEditPointTypeTemplate = (currentType, isDisabled) =>
  Object.values(PointType).map((type) => `
    <div class="event__type-item">
      <input id="event-type-${type}-1"
             class="event__type-input visually-hidden"
             type="radio"
             name="event-type"
             value="${type}"
             ${currentType === type ? 'checked' : ''}
             ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label event__type-label--${type}"
             for="event-type-${type}-1">
        ${PointTypeDescription[type]}
      </label>
    </div>`
  ).join('');

const renderResetButtonTemplate = (isNewPoint, isDisabled, isDeleting) =>
  isNewPoint ? `
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
      Cancel
    </button>` : `
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
      ${isDeleting ? 'Deleting...' : 'Delete'}
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;

const createEditRoutePointTemplate = (point, destinations, offersByType, isNewPoint, offers1) => {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    isDisabled,
    isSaving,
    isDeleting
  } = point;
  const destinationData = destinations.find((dest) => dest.id === destination.id);

  const currentOffers = offers1.find((offer) => offer.type === type);
  const selectedOffers = point.offers
    .filter((offer) => offer.isSelected)
    .map((offer) => offer.id);


  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${renderEditPointTypeTemplate(type, isDisabled)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input event__input--destination"
                   id="event-destination-1"
                   type="text"
                   name="event-destination"
                   value="${destinationData?.name ? he.encode(destinationData.name) : ''}"
                   list="destination-list-1"
                   ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${renderDestinationNames(destinations)}
            </datalist>
          </div>

          ${renderEditPointDateTemplate(dateFrom, dateTo, isDisabled)}

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price"
                   id="event-price-1"
                   type="number"
                   name="event-price"
                   value="${basePrice}"
                   ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn btn btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          ${renderResetButtonTemplate(isNewPoint, isDisabled, isDeleting)}
        </header>

        <section class="event__details">
          ${renderOffersContainer(currentOffers, selectedOffers, isDisabled)}
          ${renderDestinationContainer(destination)}
        </section>
      </form>
    </li>`;
};

const DEFAULT_POINT = {
  type: 'flight',
  destination: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  basePrice: 0,
  offers: [],
};


export default class EditRoutePointView extends AbstractStatefulView {
  #destinations = [];
  #offers = [];
  #datepickerFrom = null;
  #datepickerTo = null;
  #isNewPoint = false;
  #handleFormSubmit = null;
  #handleCloseClick = null;
  #handleDeleteClick = null;

  constructor({ point = DEFAULT_POINT, destinations = [], offers, isNewPoint = false, onFormSubmit, onCloseClick, onDeleteClick }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#isNewPoint = isNewPoint;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;
    // console.log('destinations', destinations);

    // Преобразуем "сырой" point в state
    // const preparedPoint = EditRoutePointView.#preparePoint(point, offers);
    this._state = EditRoutePointView.parsePointToState(
      EditRoutePointView.#preparePoint(point, offers)
    );

    this._restoreHandlers();
  }


  get template() {
    const offersByType = this.#offers.find((offer) => offer.type === this._state.type);

    return createEditRoutePointTemplate(this._state, this.#destinations, offersByType, this.#isNewPoint, this.#offers);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(
      EditRoutePointView.parsePointToState(point)
    );
  }

  setSaving() {
    this.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setDeleting() {
    this.updateElement({
      isDisabled: true,
      isDeleting: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.shake(resetFormState);
  }

  _restoreHandlers() {
    this.#setInnerHandlers();
    this.#setDatepickers();

    if (!this.#isNewPoint) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#closeClickHandler);
    }

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);
  }

  #setDatepickers() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler
      }
    );
  }

  #setInnerHandlers() {
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#typeChangeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    const offersContainer = this.element.querySelector('.event__available-offers');
    // console.log('offersContainer', offersContainer);
    if (offersContainer) {
      offersContainer.addEventListener('change', this.#offersChangeHandler);
    }
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
    });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const newType = evt.target.value;

    const offersByType = this.#offers.find((offer) => offer.type === newType);

    const newOffers = offersByType?.offers.map((offer) => ({
      ...offer,
      isSelected: false,
    })) || [];

    this.updateElement({
      type: newType,
      offers: newOffers,
    });

    this._restoreHandlers();
  };


  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedName = evt.target.value;
    const selectedDestination = this.#destinations.find((dest) => dest.name === selectedName);

    if (selectedDestination &&
    (this._state.destination?.name !== selectedDestination.name)) {
      this.updateElement({
        destination: selectedDestination
      });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value)
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();

    const offerId = evt.target.id.replace('event-offer-', '');

    const updatedOffers = this._state.offers.map((offer) => {
      if (offer.id.toString() === offerId) {
        return {
          ...offer,
          isSelected: !offer.isSelected,
        };
      }
      return offer;
    });

    this.updateElement({
      offers: updatedOffers,
    });
    this._restoreHandlers();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditRoutePointView.parseStateToPoint(this._state));
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditRoutePointView.parseStateToPoint(this._state));
  };

  setCloseClickHandler(callback) {
    this.#handleCloseClick = callback;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeClickHandler);
  }


  static parsePointToState(point) {
    return {
      ...point,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return {
      ...point,
      offers: point.offers.filter((offer) => offer.isSelected)
    };
  }

  static #preparePoint(point, allOffers = []) {
    // console.log('Point offers (raw):', point.offers);

    let selectedOfferIds = [];

    if (Array.isArray(point.offers) && point.offers.length > 0) {
      if (typeof point.offers[0] === 'object') {
        if (Object.prototype.hasOwnProperty.call(point.offers[0], 'isSelected')) {
          selectedOfferIds = point.offers.filter((offer) => offer.isSelected).map((offer) => offer.id);
        } else {
          selectedOfferIds = point.offers.map((offer) => offer.id);
        }
      } else {
        selectedOfferIds = point.offers;
      }
    } else {
      selectedOfferIds = [];
    }

    // console.log('Selected offer IDs:', selectedOfferIds);

    const offerGroup = allOffers.find((group) => group.type === point.type);
    const availableOffers = offerGroup ? offerGroup.offers : [];

    const mappedOffers = availableOffers.map((offer) => {
      const isSelected = selectedOfferIds.includes(offer.id);
      // console.log(`Offer id ${offer.id} selected:`, isSelected);
      return {
        ...offer,
        isSelected,
      };
    });

    return {
      ...point,
      offers: mappedOffers
    };
  }


}
