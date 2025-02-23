import NewFormView from '../view/create-form-view.js';
import EditFormView from '../view/edit-form.js';
import FilterView from '../view/filters-view.js';
import ListElementView from '../view/list-points.js';
import PointView from '../view/point.js';
import SortView from '../view/sort-view.js';
import {render} from '../render.js';

export default class Presenter {
  listComponent = new ListElementView();

  constructor() {
    this.contentContainer = document.querySelector('.trip-events');
    this.filter = document.querySelector('.trip-controls__filters');
  }

  init() {
    render(new FilterView(), this.filter);
    render(new SortView(), this.contentContainer);
    render(this.listComponent, this.contentContainer);
    render(new EditFormView(), this.listComponent.getElement());
    render(new NewFormView(), this.listComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.listComponent.getElement());
    }

  }
}
