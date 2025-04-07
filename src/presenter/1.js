// import PointView from '../views/point-view.js';
// import EditPointView from '../views/edit-point-view.js';
// import { render, replace } from '../framework/render.js';
import { MessageBoard } from '../const.js';
import ListMessageView from '../view/list-message-view.js';
// import PointsListView from '../views/points-list-view.js';

// import NewFormView from '../view/create-form-view.js';
import EditFormView from '../view/edit-form.js';
import FilterView from '../view/filters-view.js';
import ListElementView from '../view/list-points.js';
import PointView from '../view/point.js';
import SortView from '../view/sort-view.js';
import { render, replace } from '../framework/render.js';
import { generatePoints } from '../mock/point.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsListComponent = new ListElementView();
  #pointsData = [];
  #offersData = [];
  #destinationsData = [];

  constructor({ pointsModel, offersModel, destinationsModel }) {
    this.#boardContainer = document.querySelector('.trip-events');
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#pointsData = [generatePoints(3)];
    // this.#offersData = [...this.#offersModel.offers];
    // this.#destinationsData = [...this.#destinationsModel.destinations];
    render(new FilterView(), this.#boardContainer);
    this.#renderBoard();
  }

  /**
 * Рендерит точку маршрута и управляет переключением между режимами просмотра и редактирования
 * @param {Object} point - Данные точки маршрута
 * @param {Array} offers - Доступные предложения
 * @param {Array} destinations - Доступные направления
 */
  #renderPoint(point) {
    /*
    * Логика обработки кликов (стрелка или кнопка save).
    * Реализует замену точки на форму редактирования и обратно.
    * Поведение описано здесь (а не во View), потому что здесь создаются
    * компоненты, которые заменяют друг друга.
    * Логика передается через конструктор в компонент (View).
    */

    // Обработчик нажатия клавиши Escape
    const escKeyHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        // eslint-disable-next-line no-use-before-define
        replaceEditPointToPoint();
        document.removeEventListener('keydown', escKeyHandler);
      }
    };

    // Обработчик открытия формы редактирования
    const onOpenEditButtonClick = () => {
      // eslint-disable-next-line no-use-before-define
      replacePointToEditPoint();
      document.addEventListener('keydown', escKeyHandler);
    };

    // Обработчик закрытия формы редактирования
    const onCloseEditButtonClick = () => {
      // eslint-disable-next-line no-use-before-define
      replaceEditPointToPoint();
      document.removeEventListener('keydown', escKeyHandler);
    };

    // Создание компонентов
    const pointComponent = new PointView({
      point,
      onEditClick: onOpenEditButtonClick
    });

    const editPointComponent = new EditFormView({
      point,
      onFormSubmit: onCloseEditButtonClick,
      onCloseClick: onCloseEditButtonClick
    });

    // Функции замены компонентов
    const replacePointToEditPoint = () => {
      replace(editPointComponent, pointComponent);
    };

    const replaceEditPointToPoint = () => {
      replace(pointComponent, editPointComponent);
    };

    // Первоначальный рендеринг точки
    render(pointComponent, this.#pointsListComponent.element);
  }

  #renderBoard() {
    // Рендерим компоненты сортировки и списка точек
    render(new SortView(), this.#boardContainer);
    render(this.#pointsListComponent, this.#boardContainer);
    this.#pointsData = generatePoints(5);


    if (this.#pointsData.length > 0) {
      // Рендерим точки (не более SHOW_POINT_COUNT)
      const pointsToRender = this.#pointsData.length;
      for (let i = 0; i < pointsToRender; i++) {
        this.#renderPoint(
          this.#pointsData[i],
        );
      }
    } else {

      render(
        new ListMessageView({ message: MessageBoard.EMPTY_LIST }),
        this.#pointsListComponent.element
      );
    }
  }
}
