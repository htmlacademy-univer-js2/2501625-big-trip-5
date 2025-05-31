import BoardPresenter from './presenter/main-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

// Контейнеры из DOM
const siteMainElement = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');

// Модели
const pointsModel = new PointsModel();
const filterModel = new FilterModel();

// Презентер фильтра
const filterPresenter = new FilterPresenter({
  filterContainer: siteFilterElement,
  filterModel,
  pointsModel
});

// Презентер доски
const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  filterContainer: siteFilterElement,
  pointsModel,
  filterModel
});

// Инициализация
filterPresenter.init();
boardPresenter.init();
