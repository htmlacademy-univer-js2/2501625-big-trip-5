import {createElement} from '../render.js';

function createListElementTemplate() {
  return (
    `<ul class="trip-events__list">
`
  );
}

export default class ListElementView {
  getTemplate() {
    return createListElementTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
