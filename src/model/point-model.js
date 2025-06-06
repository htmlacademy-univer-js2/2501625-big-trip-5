import Observable from '../framework/observable.js';


export default class PointsModel extends Observable {
  #points = [];

  #pointsApiService;

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  #hasError = false;

  async init() {
    this._notify('loading');
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#hasError = false;
      this._notify('init');
    } catch (error) {
      this.#points = [];
      this.#hasError = true;
      this._notify('error');
    }
  }


  get hasError() {
    return this.#hasError;
  }


  get points() {
    return this.#points;
  }


  setPoints(points) {
    this.#points = [...points];
    this._notify('major');
  }

  getPoints() {
    return this.#points;
  }

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point (id: ${updatedPoint.id})`);
    }

    try {
      const response = await this.#pointsApiService.updatePoint(updatedPoint);
      const adaptedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        adaptedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, adaptedPoint);
    } catch (error) {
      throw new Error(`Can't update point: ${error}`);
    }
  }


  async addPoint(updateType, newPoint) {
    try {
      const response = await this.#pointsApiService.addPoint(newPoint);
      const adaptedPoint = this.#adaptToClient(response);
      this.#points = [adaptedPoint, ...this.#points];
      this._notify(updateType, adaptedPoint);
    } catch (error) {
      throw new Error(`Can't add point: ${error}`);
    }
  }


  async deletePoint(updateType, pointToDelete) {
    const index = this.#points.findIndex((point) => point.id === pointToDelete.id);
    if (index === -1) {
      throw new Error(`Can't delete unexisting point (id: ${pointToDelete.id})`);
    }

    try {
      await this.#pointsApiService.deletePoint(pointToDelete);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (error) {
      throw new Error(`Can't delete point: ${error}`);
    }
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
