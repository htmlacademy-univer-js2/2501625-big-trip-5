import BoardPresenter from './presenter/1.js';
import PointsModel from './model/model.js';
// import OffersModel from './model/offers-model.js';
// import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

// Создаём модели
const pointsModel = new PointsModel();
// const offersModel = new OffersModel(); // ✅
// const destinationsModel = new DestinationsModel(); // ✅
const filterModel = new FilterModel();

// Презентер доски
const boardPresenter = new BoardPresenter({
  pointsModel,
  // offersModel, // ✅ передано
  // destinationsModel, // ✅ передано
  filterModel
});

// Презентер фильтра
const filterPresenter = new FilterPresenter({
  filterContainer: document.querySelector('.trip-controls__filters'),
  filterModel,
  pointsModel
});

// Инициализация
filterPresenter.init();
boardPresenter.init();
