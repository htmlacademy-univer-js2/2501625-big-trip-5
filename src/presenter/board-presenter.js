import PointPresenter from './point-presenter.js'; // Импортируем новый презентер
import { render } from '../framework/render.js';
import FilterView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import { MessageBoard } from '../const.js';
import ListMessageView from '../view/list-message-view.js';
import ListElementView from '../view/list-points-view.js';
// в presenter/1.js или где нужно
import { UserAction } from '../const.js';


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
  #filterModel = null;
  #newEventButton = document.querySelector('.trip-main__event-add-btn');
  #isCreatingPoint = false;
  #onNewPointFormClose = null;


  constructor({ pointsModel, filterModel }) {
    this.#boardContainer = document.querySelector('.trip-events');
    this.#pointsModel = pointsModel;
    // this.#offersModel = offersModel;
    // this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.#filterModel.addObserver(this.#handleModelEvent); // добавлено
    this.#pointsModel.addObserver(this.#handleModelEvent); // добавлено
    this.#newEventButton.addEventListener('click', this.#handleNewPointClick);


    render(new FilterView({
      currentFilterType: this.#filterModel.filter,
      onFilterChange: this.#handleFilterChange,
    }), this.#boardContainer);

    this.#renderBoard();
  }

  #handleNewPointClick = () => {
    if (this.#isCreatingPoint) {
      return; // не даём открыть вторую форму
    }

    this.#filterModel.setFilter('major', 'everything'); // сброс фильтра
    this.#currentSortType = 'sort-day'; // сброс сортировки
    this.#clearPoints(); // очищаем список
    this.#renderBoard(); // перерисовываем

    this.#createNewPoint(); // запускаем создание новой точки
  };

  #createNewPoint() {
    const newPoint = {
      id: crypto.randomUUID(), // или Date.now(), или 'temp-id'
      basePrice: 0,
      dateFrom: new Date().toISOString(),
      dateTo: new Date().toISOString(),
      destination: null,
      offers: [],
      type: 'flight',
      isFavorite: false,
    };

    const presenter = new PointPresenter({
      boardContainer: this.#pointsListComponent.element,
      changeData: this.#handleUserAction,
      changeMode: this.#handleModeChange,
      onDestroy: this.#onNewPointFormClose,
    });

    presenter.init(newPoint, true); // true — режим создания новой точки
    this.#pointPresenters.set(newPoint.id, presenter);
    this.#isCreatingPoint = true;
  }

  #getFilteredPoints() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.getPoints();

    switch (filterType) {
      case 'future':
        return points.filter((point) => new Date(point.dateFrom) > new Date());
      case 'past':
        return points.filter((point) => new Date(point.dateTo) < new Date());
      default:
        return points;
    }
  }

  #handleModelEvent = () => {
    this.#clearPoints();
    this.#renderBoard();
  };

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter('major', filterType);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearPoints();

    const sortedPoints = this.#sortPoints(this.#getFilteredPoints());
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

  #handleUserAction = (actionType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(update);
        break;

      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(update);
        break;

      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(update);
        break;
    }

    this.#clearPoints();
    this.#renderBoard();
  };


  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPoints() {
    this.#pointsData.forEach((point) => this.#renderPoint(point));
  }

  #handleDataChange = (updatedPoint) => {
    try {
      this.#pointsModel.updatePoint(updatedPoint);
      this.#pointsData = this.#pointsModel.points;
      this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
    } catch (err) {
      // console.error(err.message);
    }
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
      changeData: (updatedPoint) => {
        this.#handleUserAction(UserAction.UPDATE_POINT, updatedPoint);
      },

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

    const sortedPoints = this.#sortPoints(this.#getFilteredPoints());

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
