import { render, remove, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
// import FilterView from '../view/filters-view.js';
import ListMessageView from '../view/list-message-view.js';
import ListElementView from '../view/list-points-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import TripInfoView from '../view/main-info-trip-view.js';
import NewPointPresenter from './newpoint-presenter.js';
import { sortPoints, filterPoints } from '../utils/filter-sort.js';
import { FilterType, PointAction, UpdateType, SortType, MessageBoard } from '../const.js';

export default class BoardPresenter {
  #boardContainer;
  #filterContainer;
  #pointsModel;
  #filterModel;
  #destinationsModel;
  #offersModel;

  #filterComponent = null;
  #sortComponent = null;
  #loadingComponent = null;
  #pointsListComponent = null;
  #isLoading = true;
  #noPointsComponent = null;
  #tripInfoComponent = null;

  #pointPresenters = new Map();
  #openedPointPresenter = null;
  #isCreatingPoint = false;


  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #currentFilterType = FilterType.EVERYTHING;

  #createPointPresenter = null;

  constructor({ boardContainer, filterContainer, pointsModel, filterModel, destinationsModel, offersModel }) {
    this.#boardContainer = boardContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

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

        // Сбрасываем фильтр и сортировку
        this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
        this.#currentSortType = SortType.DAY;
        this.createPoint();
      });
    }
  }


  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.getPoints();
    const filteredPoints = filterPoints[this.#currentFilterType](points);
    // console.log('Текущий фильтр:', this.#currentFilterType);
    // console.log('Отфильтрованные точки:', filteredPoints);
    const sortedPoints = sortPoints[this.#currentSortType](filteredPoints);
    return sortedPoints;
  }


  init() {
    // this.#renderFilter();
    this.#renderBoard();
  }

  createPoint() {
    const addButton = document.querySelector('.trip-main__event-add-btn');
    if (addButton) {
      addButton.disabled = true;
    }

    // Убираем сообщение о пустом списке, если оно есть
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }

    if (!this.#pointsListComponent) {
      this.#pointsListComponent = new ListElementView();
      render(this.#pointsListComponent, this.#boardContainer);
    }

    const containerElement = this.#pointsListComponent.element;
    if (!containerElement) {
      throw new Error('pointsListComponent.element is not available');
    }

    if (!this.#createPointPresenter) {
      this.#createPointPresenter = new NewPointPresenter({
        container: containerElement,
        changeData: this.#handleUserAction,
        changeMode: () => this.#handleModeChange(),
        destinations: this.#destinationsModel,
        offers: this.#offersModel,
      });
    }

    this.#handleModeChange();

    this.#createPointPresenter.init(containerElement, () => {
      this.#isCreatingPoint = false;

      // 💥 Вот тут перерисовка, если точек нет
      if (!this.#pointsModel.getPoints().length) {
        this.#clearBoard();
        this.#renderBoard();
      }

      if (addButton) {
        addButton.disabled = false;
      }
    });


    this.#isCreatingPoint = true;
  }


  createNewPoint(callback) {
    // this.#currentSortType = SortType.DAY;
    // this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.createPoint(callback);

  }

  #renderLoading() {
    if (!this.#loadingComponent) {
      this.#loadingComponent = new LoadingView();
      render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
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

    const tripMainElement = document.querySelector('.trip-main');
    render(this.#tripInfoComponent, tripMainElement, RenderPosition.AFTERBEGIN);
  }


  #clearLoading() {
    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
      this.#loadingComponent = null;
    }
  }

  #handleModeChange = (presenter = null) => {
    if (presenter) {
      if (this.#openedPointPresenter && this.#openedPointPresenter !== presenter) {
        this.#openedPointPresenter.resetView();
      }

      if (this.#isCreatingPoint) {
        this.#createPointPresenter.destroy();
        this.#isCreatingPoint = false;
      }

      this.#openedPointPresenter = presenter;

    } else {
      if (this.#openedPointPresenter) {
        this.#openedPointPresenter.resetView();
        this.#openedPointPresenter = null;
      }

      if (this.#isCreatingPoint) {
        this.#createPointPresenter.destroy();
        this.#isCreatingPoint = false;

        if (!this.#isLoading) {
          this.#clearBoard();
          this.#renderBoard();
        }
      }

    }
  };


  #handleUserAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case PointAction.UPDATE:
        await this.#pointsModel.updatePoint(updateType, update);
        break;
      case PointAction.ADD:
        await this.#pointsModel.addPoint(updateType, update);
        this.#createPointPresenter.destroy();
        break;
      case PointAction.DELETE:
        await this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case 'loading':
        this.#isLoading = true;
        this.#renderLoading();
        break;
      case 'error':
        this.#isLoading = false;
        this.#clearLoading();
        this.#renderError(); // рендерим ошибку
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
      case 'init':
        this.#isLoading = false;
        this.#clearLoading();
        this.#renderBoard();
        break;
    }
  };

  #renderError() {
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }
    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }
    if (this.#pointsListComponent) {
      remove(this.#pointsListComponent);
      this.#pointsListComponent = null;
    }
    this.#noPointsComponent = new ListMessageView({ message: MessageBoard.LOAD_ERROR });
    render(this.#noPointsComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

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
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListComponent.element,
      changeData: this.#handleUserAction,
      changeMode: this.#handleModeChange,
      destinations: this.#destinationsModel,
      offers: this.#offersModel,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);

    // Добавь это:
    pointPresenter.setOnModeChange(() => {
      this.#handleModeChange(pointPresenter);
    });

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

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    this.#noPointsComponent = new ListMessageView({ message });
    render(this.#noPointsComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
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

    if (!this.#pointsListComponent) {
      this.#pointsListComponent = new ListElementView();
      render(this.#pointsListComponent, this.#boardContainer);
    }
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

    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
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
