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
    this.#destinations = destinations;
    this.#offers = offers;
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
    console.log(this.#mode !== Mode.DEFAULT, this.#mode);
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditForm() {
    console.log('start');
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
    console.log(this.#mode !== Mode.DEFAULT, this.#mode);
  }

  #replaceEditFormToPoint() {
    console.log('end');
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

  #handleFavoriteClick = () => {
    this.#changeData(
      PointAction.UPDATE,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleEditClick = () => {
    this.#replacePointToEditForm();
  };

  #handleCloseClick = () => {
    this.resetView();
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#changeData(
      PointAction.UPDATE,
      UpdateType.MINOR,
      updatedPoint,
    );
    this.#replaceEditFormToPoint();
  };

  #handleDeleteClick = () => {
    this.#changeData(
      PointAction.DELETE,
      UpdateType.MINOR,
      this.#point,
    );
  };
}
