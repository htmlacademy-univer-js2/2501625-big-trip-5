
import NewFormView from '../view/create-form-view.js';
import EditFormView from '../view/edit-form.js';
import FilterView from '../view/filters-view.js';
import ListElementView from '../view/list-points.js';
import PointView from '../view/point.js';
import SortView from '../view/sort-view.js';
import {render} from '../render.js';
import {generatePoints} from '../mock/point.js';

export default class Presenter {
  listComponent = new ListElementView();

  constructor() {
    this.contentContainer = document.querySelector('.trip-events');
    this.filterContainer = document.querySelector('.trip-controls__filters');
  }

  init() {

    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.contentContainer);
    render(new NewFormView(), this.contentContainer);
    render(this.listComponent, this.contentContainer);


    const points = generatePoints(3);

    points.forEach((point) => {
      const pointView = new PointView(point);
      render(pointView, this.listComponent.getElement());

      pointView.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
        render(new EditFormView(point), this.listComponent.getElement());
      });
    });

    document.querySelector('.trip-main__event-add-btn').addEventListener('click', () => {
      render(new NewFormView(), this.contentContainer);
    });
  }
}

