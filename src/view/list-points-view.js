import AbstractView from '../framework/view/abstract-view.js';

function createListElementTemplate() {
  return (
    `<ul class="trip-events__list">
`
  );
}

export default class ListElementView extends AbstractView {
  get template() {
    return createListElementTemplate();
  }
}
