import Observable from '../framework/observable.js';
import { ServerKeys, UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #pointsApiService;
  #hasError = false;


  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }


  async init() {
    this._notify(UpdateType.LOADING);
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#hasError = false;
      this._notify(UpdateType.INIT);
    } catch (error) {
      this.#points = [];
      this.#hasError = true;
      this._notify(UpdateType.ERROR);
    }
  }


  setPoints(points) {
    this.#points = [...points];
    this._notify(UpdateType.MAJOR);
  }


  get hasError() {
    return this.#hasError;
  }

  getPoints() {
    return this.#points;
  }

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    const response = await this.#pointsApiService.updatePoint(updatedPoint);
    const adaptedPoint = this.#adaptToClient(response);

    this.#points = [
      ...this.#points.slice(0, index),
      adaptedPoint,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, adaptedPoint);
  }

  async addPoint(updateType, newPoint) {

    const response = await this.#pointsApiService.addPoint(newPoint);
    const adaptedPoint = this.#adaptToClient(response);
    this.#points = [adaptedPoint, ...this.#points];
    this._notify(updateType, adaptedPoint);
  }

  async deletePoint(updateType, pointToDelete) {
    const index = this.#points.findIndex((point) => point.id === pointToDelete.id);

    await this.#pointsApiService.deletePoint(pointToDelete);
    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType);

  }


  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point[ServerKeys.BASE_PRICE],
      dateFrom: point[ServerKeys.DATE_FROM] ? new Date(point[ServerKeys.DATE_FROM]) : null,
      dateTo: point[ServerKeys.DATE_TO] ? new Date(point[ServerKeys.DATE_TO]) : null,
      isFavorite: point[ServerKeys.IS_FAVORITE],
    };

    delete adaptedPoint[ServerKeys.BASE_PRICE];
    delete adaptedPoint[ServerKeys.DATE_FROM];
    delete adaptedPoint[ServerKeys.DATE_TO];
    delete adaptedPoint[ServerKeys.IS_FAVORITE];

    return adaptedPoint;
  }
}
