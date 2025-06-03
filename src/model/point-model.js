import Observable from '../framework/observable.js';


export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];

  #pointsApiService = null;
  #destinationsApiService = null;
  #offersApiService = null;

  constructor({ pointsApiService, destinationsApiService, offersApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#destinationsApiService = destinationsApiService;
    this.#offersApiService = offersApiService;
  }

  async init() {
    this._notify('loading');
    try {
      const points = await this.#pointsApiService.points;
      console.log('Points from API:', points);
      const destinations = await this.#destinationsApiService.destinations;
      const offers = await this.#offersApiService.offers;

      this.#points = points.map(this.#adaptToClient);
      this.#destinations = destinations;
      this.#offers = offers;

      this._notify('init');
    } catch (error) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      console.error('Points loading error:', error);

      this._notify('init');
    }
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  setPoints(points) {
    this.#points = [...points];
    this._notify('major');
  }

  getPoints() {
    return this.#points;
  }

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point (id: ${updatedPoint.id})`);
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1),
    ];

    this._notify('minor');
  }

  addPoint(newPoint) {
    this.#points = [newPoint, ...this.#points];
    this._notify('minor');
  }

  deletePoint(pointToDelete) {
    this.#points = this.#points.filter((point) => point.id !== pointToDelete.id);
    this._notify('minor');
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] ? new Date(point['date_from']) : null,
      dateTo: point['date_to'] ? new Date(point['date_to']) : null,
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
