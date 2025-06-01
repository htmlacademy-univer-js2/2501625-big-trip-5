import { render, remove, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
// import FilterView from '../view/filters-view.js';
import ListMessageView from '../view/list-message-view.js';
import ListElementView from '../view/list-points-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './newpoint-presenter.js';
import { sortPoints, filterPoints } from '../utils/filter-sort.js';
import { FilterType, PointAction, UpdateType, SortType, MessageBoard } from '../const.js';

export default class BoardPresenter {
  #boardContainer;
  #filterContainer;
  #pointsModel;
  #filterModel;

  #filterComponent = null;
  #sortComponent = null;
  #pointsListComponent = null;
  #noPointsComponent = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #currentFilterType = FilterType.EVERYTHING;
  #isCreatingPoint = false;

  #createPointPresenter = null;

  constructor({ boardContainer, filterContainer, pointsModel, filterModel }) {
    this.#boardContainer = boardContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    // this.#newPointPresenter = new NewPointPresenter(this.#boardContainer, this.#handleUserAction, this.#pointsModel);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    // this.#createPointPresenter = new NewPointPresenter(this.#pointsListComponent?.element, this.#handleUserAction);

    // --- Вот сюда добавляем обработчик кнопки "Добавить событие":
    const addButton = document.querySelector('.trip-main__event-add-btn');
    if (addButton) {
      addButton.addEventListener('click', (evt) => {
        evt.preventDefault();

        if (this.#isCreatingPoint) {
          return;
        }

        this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
        this.createPoint();
      });
    }
  }


  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.getPoints();
    const filteredPoints = filterPoints[this.#currentFilterType](points);
    sortPoints[this.#currentSortType](filteredPoints);
    return filteredPoints;
  }

  init() {
    // this.#renderFilter();
    this.#renderBoard();
  }

  createPoint(callback) {
    if (!this.#createPointPresenter) {
      if (!this.#pointsListComponent) {
        this.#pointsListComponent = new ListElementView();
        render(this.#pointsListComponent, this.#boardContainer);
      }
      this.#createPointPresenter = new NewPointPresenter(this.#pointsListComponent.element, this.#handleUserAction);
    }

    this.#createPointPresenter.init(() => {
      this.#isCreatingPoint = false;
      if (callback) {
        callback();
      }
    });

    this.#isCreatingPoint = true;
  }

  createNewPoint(callback) {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.createPoint(callback);

  }

  #handleModeChange = () => {
    // this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleUserAction = (actionType, updateType, update) => {
    switch (actionType) {
      case PointAction.UPDATE:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case PointAction.ADD:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case PointAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        // this.#renderFilter();
        this.#renderBoard();
        break;
    }
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleFilterChange = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };


  // #renderFilter() {
  //   if (this.#filterComponent) {
  //     remove(this.#filterComponent);
  //   }
  //   this.#filterComponent = new FilterView({
  //     currentFilterType: this.#filterModel.filter,
  //     onFilterChange: this.#handleFilterChange,
  //   });
  //   render(this.#filterComponent, this.#filterContainer);
  // }


  #renderSort() {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(
      this.#pointsListComponent.element,
      this.#handleUserAction,
      this.#handleModeChange,
      this.#pointsModel
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    const message = MessageBoard[this.#currentFilterType] || MessageBoard[FilterType.EVERYTHING];

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }

    this.#noPointsComponent = new ListMessageView({ message });
    render(this.#noPointsComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }


  #renderBoard() {
    const points = this.points;

    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();

    if (!this.#pointsListComponent) {
      this.#pointsListComponent = new ListElementView();
      render(this.#pointsListComponent, this.#boardContainer);
    }
    this.#createPointPresenter = new NewPointPresenter(this.#pointsListComponent.element, this.#handleUserAction);
    this.#renderPoints(points);
  }

  #clearBoard({ resetSortType = false } = {}) {
    // this.#newPointPresenter.destroy();

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }

    if (this.#pointsListComponent) {
      remove(this.#pointsListComponent);
      this.#pointsListComponent = null;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
