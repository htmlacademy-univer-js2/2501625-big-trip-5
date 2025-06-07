import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { render, replace, remove } from '../framework/render.js';
import { PointAction, UpdateType, Mode } from '../const.js';
export default class PointPresenter {
  #point = null;
  #pointComponent = null;
  #pointListContainer = null;
  #editFormComponent = null;
  #onDataChange = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;
  #destinations = [];
  #offers = [];

  constructor({ pointListContainer, changeData, changeMode, destinations, offers }) {
    this.#pointListContainer = pointListContainer;
    this.#onDataChange = changeData;
    this.#onModeChange = changeMode;
    this.#destinations = destinations.destinations;
    this.#offers = offers.offers;
  }

  init(point) {
    const destination = this.#destinations.find((dest) => dest.id === point.destination);
    const offerGroup = this.#offers.find((group) => group.type === point.type);
    const availableOffers = offerGroup?.offers || [];

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
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editFormComponent = new EditFormView({
      point: pointWithFullData,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onCloseClick: this.#onCloseClick
    });

    this.#editFormComponent.setCloseClickHandler(this.#onCloseClick);
    this.#editFormComponent._restoreHandlers();

    if (!prevPointComponent || !prevEditFormComponent) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  setOnModeChange(callback) {
    this.#onModeChange = callback;
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.reset(this.#point);
      this.#hideEditForm();
    }
  }


  #showEditForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #hideEditForm() {
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
      await this.#onDataChange(PointAction.UPDATE, UpdateType.PATCH, updatedPoint);
    } catch {
      if (this.#editFormComponent) {
        this.#editFormComponent.setAborting();
      } else if (this.#pointComponent) {
        this.#pointComponent.shake?.();
      }
    }
  };

  #onEditClick = () => {
    this.#showEditForm();
    this.#onModeChange(this);
  };

  #onCloseClick = () => {
    this.resetView();
  };

  #handleFormSubmit = async (updatedPoint) => {
    this.#editFormComponent.setSaving();

    try {
      await this.#onDataChange(PointAction.UPDATE, UpdateType.MINOR, updatedPoint);
      this.#hideEditForm();
    } catch {
      this.#editFormComponent.setAborting();
    }
  };

  #handleDeleteClick = async () => {
    this.#editFormComponent.setDeleting();

    try {
      await this.#onDataChange(PointAction.DELETE, UpdateType.MINOR, this.#point);
    } catch {
      this.#editFormComponent.setAborting();
    }
  };
}
