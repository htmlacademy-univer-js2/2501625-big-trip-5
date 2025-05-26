import Observable from '../framework/observable.js'; // подключи Observable
import { generatePoints } from '../mock/point.js';
import { POINT_COUNT } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];

  constructor() {
    super(); // обязательно вызвать super() при наследовании
    this.#points = generatePoints(POINT_COUNT);
  }

  get points() {
    return this.#points;
  }

  setPoints(points) {
    this.#points = [...points];
    this._notify('major'); // уведомим наблюдателей
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

    this._notify('minor'); // уведомим наблюдателей об изменении
  }

  addPoint(newPoint) {
    this.#points = [newPoint, ...this.#points];
  }

  deletePoint(pointToDelete) {
    this.#points = this.#points.filter((point) => point.id !== pointToDelete.id);
  }

}
