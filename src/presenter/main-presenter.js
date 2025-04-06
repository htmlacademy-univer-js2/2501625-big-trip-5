import NewFormView from '../view/create-form-view.js';
import EditFormView from '../view/edit-form.js';
import FilterView from '../view/filters-view.js';
import ListElementView from '../view/list-points.js';
import PointView from '../view/point.js';
import SortView from '../view/sort-view.js';
import { render, replace } from '../framework/render.js';
import { generatePoints } from '../mock/point.js';

export default class Presenter {
  #listComponent = new ListElementView();
  #contentContainer = null;
  #filterContainer = null;
  #points = [];

  constructor() {
    this.#contentContainer = document.querySelector('.trip-events');
    this.#filterContainer = document.querySelector('.trip-controls__filters');
  }

  init() {
    render(new FilterView(), this.#filterContainer);
    render(new SortView(), this.#contentContainer);
    render(this.#listComponent, this.#contentContainer);

    this.#points = generatePoints(3);
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });

    // Обработчик для добавления новой формы
    document.querySelector('.trip-main__event-add-btn').addEventListener('click', () => {
      render(new NewFormView(), this.#contentContainer);
    });

    // Добавление глобальных обработчиков событий
    this.#addGlobalEventListeners();
  }

  #addGlobalEventListeners() {
    // Обработчик для клавиши Esc
    document.addEventListener('keydown', this.#escKeyDownHandler);

    // Обработчик для кнопки "Стрелка вверх" (сворачивание)
    document.addEventListener('click', this.#onCollapseClick);
  }

  #onCollapseClick = (e) => {
    const collapseButton = e.target.closest('.event__rollup-btn');
    if (collapseButton) {
      const editForm = document.querySelector('.event--edit');
      if (editForm) {
        const pointId = editForm.dataset.id;
        const point = this.#points.find((p) => p.id === pointId);
        if (point) {
          this.#replaceFormWithPoint(point, editForm);
        }
      }
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      // Нужно найти текущую открытую форму и закрыть её
      const openForm = this.#contentContainer.querySelector('.event--edit');
      if (openForm) {
        const pointId = openForm.dataset.id;
        const point = this.#points.find((p) => p.id === pointId);
        if (point) {
          this.#replaceFormWithPoint(point, openForm);
        }
      }
    }
  };

  #renderPoint(point) {
    const pointView = new PointView({
      point,
      onExpandClick: () => this.#replacePointWithForm(point, pointView),
    });

    render(pointView, this.#listComponent.element);
  }

  #replacePointWithForm(point, pointView) {
    const editFormView = new EditFormView({
      point,
      onFormSubmit: () => this.#replaceFormWithPoint(point, editFormView),
      onCollapseClick: () => this.#replaceFormWithPoint(point, editFormView),
    });

    // Удаляем старую точку маршрута и рендерим новую форму
    replace(editFormView, pointView);
  }

  #replaceFormWithPoint(point, editFormView) {
    const pointView = new PointView({
      point,
      onExpandClick: () => this.#replacePointWithForm(point, pointView),
    });

    // Удаляем старую форму редактирования перед рендером новой точки
    replace(pointView, editFormView);
  }
}
