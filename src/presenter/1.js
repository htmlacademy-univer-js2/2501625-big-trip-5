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
    render(new SortView(), this.#boardContainer);

    this.#pointsListComponent = new ListElementView(); // <-- Обязательно!
    render(this.#pointsListComponent, this.#boardContainer);

    if (this.#pointsData.length > 0) {
      this.#pointsData.forEach((point) => this.#renderPoint(point));
    } else {
      render(
        new ListMessageView({ message: MessageBoard.EMPTY_LIST }),
        this.#pointsListComponent.element
      );
    }
  }

}
