import AbstractView from '../framework/view/abstract-view';

function createLoadingTemplate() {
  return (
    '<p class="trip-events__msg">Loading...</p>'
  );
}

export default class ListMessageView extends AbstractView {

  get template() {
    return createLoadingTemplate();
  }
}
