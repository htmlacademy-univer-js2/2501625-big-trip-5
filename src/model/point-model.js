import Observable from '../framework/observable.js';
// import { generatePoints } from '../mock/point1.js';
// import { POINT_COUNT } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];

  init(points, destinations, offers) {
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
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

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point (id: ${updatedPoint.id})`);
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1)
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


  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
