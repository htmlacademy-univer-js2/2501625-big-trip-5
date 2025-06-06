import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { render, replace, remove } from '../framework/render.js';
import { PointAction, UpdateType, Mode } from '../const.js';
export default class PointPresenter {
  #point = null;
  #pointComponent = null;
  #pointListContainer = null;
  #editFormComponent = null;
  // #boardContainer = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  #destinations = [];
  #offers = [];

  constructor({ pointListContainer, changeData, changeMode, destinations, offers }) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#destinations = destinations.destinations;
    this.#offers = offers.offers;
  }

  init(point) {
    const destination = this.#destinations.find((dest) => dest.id === point.destination);
    const offerGroup = this.#offers.find((group) => group.type === point.type);
    const availableOffers = offerGroup ? offerGroup.offers : [];

    const mappedOffers = availableOffers.map((offer) => ({
      ...offer,
      isSelected: point.offers.includes(offer.id),
    }));

    const pointWithFullData = {
      ...point,
      destination,
      offers: mappedOffers,
    };

    this.#point = pointWithFullData;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new PointView({
      point: pointWithFullData,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editFormComponent = new EditFormView({
      point: pointWithFullData,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
    });

    this.#editFormComponent.setCloseClickHandler(this.#handleCloseClick);

    this.#editFormComponent._restoreHandlers();

    if (!prevPointComponent || !prevEditFormComponent) {
      render(this.#pointComponent, this.#pointListContainer);
      this.#pointComponent.setHandlers();
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
      this.#pointComponent.setHandlers();
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }


  setOnModeChange(callback) {
    this.#changeMode = callback;
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  resetView() {
    // console.log(this.#mode !== Mode.DEFAULT, this.#mode);
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditForm() {
    // console.log('start');
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleFavoriteClick = async () => {
    const updatedPoint = { ...this.#point, isFavorite: !this.#point.isFavorite };

    try {
      await this.#changeData(PointAction.UPDATE, UpdateType.PATCH, updatedPoint);
      // Если нужно, можно обновить локальный state здесь,
      // но обычно это делает модель, а в презентере просто ререндер по данным
    } catch (error) {
      // console.error('Ошибка при обновлении избранного:', error);
      // Можно вызвать метод для показа shake-анимации, например:
      if (this.#editFormComponent) {
        this.#editFormComponent.setAborting();
      } else if (this.#pointComponent) {
        this.#pointComponent.shake?.();
      }
    }
  };


  #handleEditClick = () => {
    this.#replacePointToEditForm();
    this.#changeMode(this);
  };

  #handleCloseClick = () => {
    this.resetView();
  };

  #handleFormSubmit = async (updatedPoint) => {
    this.#editFormComponent.setSaving();

    try {
      await this.#changeData(
        PointAction.UPDATE,
        UpdateType.MINOR,
        updatedPoint
      );

      this.#replaceEditFormToPoint();
    } catch (err) {
      this.#editFormComponent.setAborting();
    }
  };


  #handleDeleteClick = async () => {
    this.#editFormComponent.setDeleting(); // Блокируем интерфейс, меняем кнопку на "Deleting..."

    try {
      await this.#changeData(
        PointAction.DELETE,
        UpdateType.MINOR,
        this.#point,
      );

      // После успешного удаления, можно закрыть форму/удалить компонент
      // Вариант:
      // this.destroy(); // если ты хочешь полностью убрать компонент
    } catch (err) {
      this.#editFormComponent.setAborting(); // Shake + разблокировка интерфейса при ошибке
    }
  };

}
