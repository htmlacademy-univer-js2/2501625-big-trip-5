import FilterView from '../view/filters-view.js';
import { render, replace, remove } from '../framework/render.js';
// import { FilterType } from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    const prevComponent = this.#filterComponent;
    this.#filterComponent = new FilterView({
      currentFilterType: this.#filterModel.filter,
      onFilterChange: this.#handleFilterChange,
    });

    if (prevComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevComponent);
    remove(prevComponent);
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter('major', filterType);
  };
}
