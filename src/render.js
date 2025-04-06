// const RenderPosition = {
//   BEFOREBEGIN: 'beforebegin',
//   AFTERBEGIN: 'afterbegin',
//   BEFOREEND: 'beforeend',
//   AFTEREND: 'afterend',
// };

// function createElement(template) {
//   const newElement = document.createElement('div');
//   newElement.innerHTML = template;

//   return newElement.firstElementChild;
// }

// function render(component, container, place = RenderPosition.BEFOREEND) {
//   if (!container || !component.getElement()) {
//     return;
//   }
//   container.insertAdjacentElement(place, component.getElement());
// }

// export {RenderPosition, createElement, render};
