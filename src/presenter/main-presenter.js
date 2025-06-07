import { render, remove, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListMessageView from '../view/list-message-view.js';
import ListElementView from '../view/list-points-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import TripInfoView from '../view/main-info-trip-view.js';
import NewPointPresenter from './newpoint-presenter.js';
import { sortPoints, filterPoints } from '../utils/filter-sort.js';
import { FilterType, PointAction, UpdateType, SortType, MessageBoard, Selectors } from '../const.js';

export default class BoardPresenter {
  #boardContainer;
  #filterContainer;
  #pointsModel;
  #filterModel;
  #destinationsModel;
  #offersModel;
  #tripMainElement;

  #filterComponent = null;
  #sortComponent = null;
  #loadingComponent = null;
  #listComponent = null;
  #messageComponent = null;
  #tripInfoComponent = null;
  #addButton = null;

  #pointPresenters = new Map();
  #openedPointPresenter = null;
  #isCreatingPoint = false;
  #isLoading = true;

  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #currentFilterType = FilterType.EVERYTHING;

  constructor({ boardContainer, filterContainer, pointsModel, filterModel, destinationsModel, offersModel }) {
    this.#boardContainer = boardContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#tripMainElement = document.querySelector(Selectors.TRIP_MAIN);
    this.#addButton = document.querySelector(Selectors.ADD_BUTTON);
    if (this.#addButton) {
      this.#addButton.addEventListener('click', this.#onAddButtonClick);
    }
  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.getPoints();
    const filteredPoints = filterPoints[this.#currentFilterType](points);
    const sortedPoints = sortPoints[this.#currentSortType](filteredPoints);
    return sortedPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    if (this.#addButton) {
      this.#addButton.disabled = true;
    }

    if (this.#messageComponent) {
      remove(this.#messageComponent);
      this.#messageComponent = null;
    }

    if (!this.#listComponent) {
      this.#listComponent = new ListElementView();
      render(this.#listComponent, this.#boardContainer);
    }

    const containerElement = this.#listComponent.element;
    if (!containerElement) {
      throw new Error('pointsListComponent.element is not available');
    }

    if (!this.#newPointPresenter) {
      this.#newPointPresenter = new NewPointPresenter({
        container: containerElement,
        changeData: this.#handleUserAction,
        changeMode: this.#handleModeChange,
        destinations: this.#destinationsModel,
        offers: this.#offersModel,
      });
    }

    this.#handleModeChange();

    this.#newPointPresenter.init(containerElement, () => {
      this.#isCreatingPoint = false;
      if (!this.#pointsModel.getPoints().length) {
        this.#clearBoard();
        this.#renderBoard();
      }
      if (this.#addButton) {
        this.#addButton.disabled = false;
      }
    });

    this.#isCreatingPoint = true;
  }

  createNewPoint() {
    this.createPoint();
  }

  destroy() {
    this.#clearBoard({ resetSortType: true });

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);

    if (this.#addButton) {
      this.#addButton.removeEventListener('click', this.#onAddButtonClick);
    }
  }


  #onAddButtonClick = (evt) => {
    evt.preventDefault();
    if (this.#isCreatingPoint) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#currentSortType = SortType.DAY;
    this.createPoint();
  };

  #handleUserAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case PointAction.UPDATE:
        await this.#pointsModel.updatePoint(updateType, update);
        break;
      case PointAction.ADD:
        await this.#pointsModel.addPoint(updateType, update);
        this.#newPointPresenter.destroy();
        break;
      case PointAction.DELETE:
        await this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.LOADING:
        this.#isLoading = true;
        this.#renderLoading();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        this.#clearLoading();
        this.#renderError();
        break;
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        this.#renderTripInfo();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#clearLoading();
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

  #handleModeChange = (presenter = null) => {
    if (presenter) {
      if (this.#openedPointPresenter && this.#openedPointPresenter !== presenter) {
        this.#openedPointPresenter.resetView();
      }
      if (this.#isCreatingPoint) {
        this.#newPointPresenter.destroy();
        this.#isCreatingPoint = false;
      }
      this.#openedPointPresenter = presenter;
    } else {
      if (this.#openedPointPresenter) {
        this.#openedPointPresenter.resetView();
        this.#openedPointPresenter = null;
      }
      if (this.#isCreatingPoint) {
        this.#newPointPresenter.destroy();
        this.#isCreatingPoint = false;
        if (!this.#isLoading) {
          this.#clearBoard();
          this.#renderBoard();
        }
      }
    }
  };

  #renderLoading() {
    if (!this.#loadingComponent) {
      this.#loadingComponent = new LoadingView();
      render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #clearLoading() {
    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
      this.#loadingComponent = null;
    }
  }

  #renderTripInfo() {
    const points = this.#pointsModel.getPoints();
    const destinations = this.#destinationsModel.destinations;
    const offers = this.#offersModel.offers;

    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
    }

    this.#tripInfoComponent = new TripInfoView(points, destinations, offers);
    render(this.#tripInfoComponent, this.#tripMainElement, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType,
    });
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#listComponent.element,
      changeData: this.#handleUserAction,
      changeMode: this.#handleModeChange,
      destinations: this.#destinationsModel,
      offers: this.#offersModel,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);

    pointPresenter.setOnModeChange(() => {
      this.#handleModeChange(pointPresenter);
    });
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    const message = MessageBoard[this.#currentFilterType] || MessageBoard[FilterType.EVERYTHING];

    if (this.#messageComponent) {
      remove(this.#messageComponent);
      this.#messageComponent = null;
    }

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    this.#messageComponent = new ListMessageView({ message });
    render(this.#messageComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderError() {
    if (this.#messageComponent) {
      remove(this.#messageComponent);
      this.#messageComponent = null;
    }
    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }
    if (this.#listComponent) {
      remove(this.#listComponent);
      this.#listComponent = null;
    }
    this.#messageComponent = new ListMessageView({ message: MessageBoard.LOAD_ERROR });
    render(this.#messageComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() {
    if (this.#isLoading) {
      return;
    }

    const points = this.points;

    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderTripInfo();
    this.#renderSort();

    if (!this.#listComponent) {
      this.#listComponent = new ListElementView();
      render(this.#listComponent, this.#boardContainer);
    }
    this.#renderPoints(points);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    if (this.#messageComponent) {
      remove(this.#messageComponent);
      this.#messageComponent = null;
    }

    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
    }

    if (this.#listComponent) {
      remove(this.#listComponent);
      this.#listComponent = null;
    }

    if (this.#isCreatingPoint && this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
      this.#isCreatingPoint = false;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
