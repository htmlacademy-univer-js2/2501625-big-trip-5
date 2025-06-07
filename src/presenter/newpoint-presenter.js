import EditFormView from '../view/edit-form-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { PointAction, UpdateType } from '../const.js';
export default class NewPointPresenter {
  #container = null;
  #destroyCallback = null;
  #onDataChange = null;
  #onModeChange = null;
  #destinations = [];
  #offers = [];
  #formComponent = null;
  #point = null;

  constructor({ container, changeData, changeMode, destinations, offers }) {
    this.#container = container;
    this.#onDataChange = changeData;
    this.#onModeChange = changeMode;
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
      onDeleteClick: this.#handleCancelClick,
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
      this.#destroyCallback();
    }
  }

  #handleFormSubmit = async (point) => {
    this.#formComponent.setSaving();
    try {
      await this.#onDataChange(PointAction.ADD, UpdateType.MAJOR, point);
    } catch (error) {
      this.#formComponent.setAborting();
    }
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
