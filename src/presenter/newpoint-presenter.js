import EditFormView from '../view/edit-form-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { PointAction, UpdateType } from '../const.js';
export default class NewPointPresenter {
  #container = null;
  #handleDataChange = null;
  #destroyCallback = null;
  #changeData = null;
  #changeMode = null;
  #destinations = [];
  #offers = [];
  #formComponent = null;
  #point = null;

  constructor({ container, changeData, changeMode, destinations, offers }) {
    this.#container = container;
    // console.log('Container:', this.#container);
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#destinations = destinations.destinations;
    this.#offers = offers.offers;
  }


  init(container, callback) {
    this.#container = container;
    this.#destroyCallback = callback;

    if (this.#formComponent !== null) {
      return;
    }

    this.#formComponent = new EditFormView({
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: true,
      onFormSubmit: this.#handleFormSubmit,
      onCloseClick: this.#handleCancelClick,
      onDeleteClick: this.#handleDeleteClick,
    });


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

  #handleFormSubmit = async (point) => {
    this.#formComponent.setSaving();
    try {
      await this.#changeData(PointAction.ADD, UpdateType.MAJOR, point);
      // УДАЛИ this.destroy();
      // Родитель (BoardPresenter) должен сам убрать форму, т.к. произойдёт перерисовка
    } catch (error) {
      // console.error('Ошибка добавления точки:', error);
      this.#formComponent.setAborting(); // форма остаётся открытой, shake + кнопки активны
    }
  };


  #handleCancelClick = () => {
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
