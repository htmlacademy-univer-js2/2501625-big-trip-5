import NewFormView from '../view/create-form-view.js'; // если у тебя NewFormView, проверь имя
import { render, remove, RenderPosition } from '../framework/render.js';
import { PointAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #container = null;
  #handleDataChange = null;
  #destroyCallback = null;

  #formComponent = null;

  constructor(container, handleDataChange) {
    this.#container = container;
    this.#handleDataChange = handleDataChange;
  }

  init(callback) {
    this.#destroyCallback = callback;

    if (this.#formComponent !== null) {
      return;
    }

    this.#formComponent = new NewFormView();

    this.#formComponent.setSubmitHandler(this.#handleFormSubmit);
    this.#formComponent.setCancelHandler(this.#handleCancelClick);

    render(this.#formComponent, this.#container, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#formComponent === null) {
      return;
    }

    remove(this.#formComponent);
    this.#formComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);

    if (this.#destroyCallback) {
      this.#destroyCallback(); // чтобы уведомить BoardPresenter, что форма закрыта
    }
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      PointAction.ADD,
      UpdateType.MAJOR,
      point
    );
    this.destroy(); // форма убирается после сохранения
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
