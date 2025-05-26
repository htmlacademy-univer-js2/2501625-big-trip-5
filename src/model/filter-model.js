import Observable from '../framework/observable.js'; // если у тебя есть реализация
import { FilterType } from '../const.js';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, newFilter) {
    if (this.#filter === newFilter) {
      return;
    }

    this.#filter = newFilter;
    this._notify(updateType); // оповестим подписчиков
  }
}
