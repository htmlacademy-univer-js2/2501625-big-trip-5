import FilterView from '../view/filters-view.js';
import { render, replace, remove } from '../framework/render.js';
import { FilterType, UpdateType } from '../const.js';
import { filterPoints } from '../utils/filter-sort.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#pointsModel.getPoints();

    const filters = Object.values(FilterType).map((filterType) => {
      const filteredPointsByType = filterPoints[filterType](points);
      return {
        type: filterType,
        disabled: filteredPointsByType.length === 0,
      };
    });


    const prevComponent = this.#filterComponent;
    this.#filterComponent = new FilterView({
      currentFilterType: this.#filterModel.filter,
      filters,
      onFilterChange: this.#handleFilterChange,
    });

    if (prevComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevComponent);
    remove(prevComponent);
  }

  destroy() {
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#pointsModel.removeObserver(this.#handleModelEvent);

    if (this.#filterComponent !== null) {
      remove(this.#filterComponent);
      this.#filterComponent = null;
    }
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

