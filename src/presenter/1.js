import PointPresenter from './point-presenter.js'; // Импортируем новый презентер
import { generatePoints } from '../mock/point.js';
import { render } from '../framework/render.js';
import FilterView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import { MessageBoard } from '../const.js';
import ListMessageView from '../view/list-message-view.js';
import ListElementView from '../view/list-points.js';


export default class BoardPresenter {
  // ...

  #pointPresenters = new Map();
  #boardContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #pointsListComponent = null;
  #pointsData = null;
  #destinationsModel = null;
  #currentSortType = 'sort-day'; // значение по умолчанию


  constructor({ pointsModel, offersModel, destinationsModel }) {
    this.#boardContainer = document.querySelector('.trip-events');
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#pointsData = generatePoints(5);

    render(new FilterView(), this.#boardContainer);
    this.#renderBoard();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearPoints();

    const sortedPoints = this.#sortPoints(this.#pointsData);
    sortedPoints.forEach((point) => this.#renderPoint(point));
  };


  #sortPoints(points) {
    switch (this.#currentSortType) {
      case 'sort-time':
        return [...points].sort((a, b) => b.duration - a.duration); // предполагаем, что есть поле `duration`
      case 'sort-price':
        return [...points].sort((a, b) => b.basePrice - a.basePrice);
      case 'sort-day':
      default:
        return [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }
  }


  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPoints() {
    this.#pointsData.forEach((point) => this.#renderPoint(point));
  }

  #handleDataChange = (updatedPoint) => {
    const index = this.#pointsData.findIndex((point) => point.id === updatedPoint.id);
    if (index === -1) {
      return;
    }

    this.#pointsData[index] = updatedPoint;

    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#resetAllPointPresentersView();
  };

  #resetAllPointPresentersView() {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      boardContainer: this.#pointsListComponent.element,
      changeData: this.#handleDataChange,
      changeMode: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderBoard() {
    const sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(sortComponent, this.#boardContainer);

    this.#pointsListComponent = new ListElementView();
    render(this.#pointsListComponent, this.#boardContainer);

    const sortedPoints = this.#sortPoints(this.#pointsData);

    if (sortedPoints.length > 0) {
      sortedPoints.forEach((point) => this.#renderPoint(point));
    } else {
      render(
        new ListMessageView({ message: MessageBoard.EMPTY_LIST }),
        this.#pointsListComponent.element
      );
    }
  }


}
