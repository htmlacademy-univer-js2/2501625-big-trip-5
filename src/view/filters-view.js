import AbstractView from '../framework/view/abstract-view.js';

function createFilterTemplate(filters, currentFilterType) {
  return (
    `<div class="trip-main__trip-controls trip-controls">
      <div class="trip-controls__filters">
        <h2 class="visually-hidden">Filter events</h2>
        <form class="trip-filters" action="#" method="get">
          ${filters.map(({ type, disabled }) => `
            <div class="trip-filters__filter">
              <input
                id="filter-${type.toLowerCase()}"
                class="trip-filters__filter-input visually-hidden"
                type="radio"
                name="trip-filter"
                value="${type.toLowerCase()}"
                ${type.toLowerCase() === currentFilterType ? 'checked' : ''}
                ${disabled ? 'disabled' : ''}
              >
              <label class="trip-filters__filter-label" for="filter-${type.toLowerCase()}">
                ${type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            </div>
          `).join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
      </div>
    </div>`
  );
}

export default class FilterView extends AbstractView {
  #onFilterChange = null;
  #currentFilterType = null;
  #filters = [];

  constructor({ currentFilterType, filters, onFilterChange }) {
    super();
    this.#currentFilterType = currentFilterType;
    this.#filters = filters;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterChange(evt.target.value);
  };
}
