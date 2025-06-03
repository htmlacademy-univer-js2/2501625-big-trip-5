import BoardPresenter from './presenter/main-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsApiService from './points-api-service.js';
import OffersApiService from './offers-api-service.js';
import DestinationsApiService from './destinations-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const offersApiService = new OffersApiService(END_POINT, AUTHORIZATION);
const destinationsApiService = new DestinationsApiService(END_POINT, AUTHORIZATION);

// Контейнеры из DOM
const siteMainElement = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');

// Модели
const pointsModel = new PointsModel({
  pointsApiService,
  destinationsApiService,
  offersApiService
});
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

const startApp = async () => {
  filterPresenter.init();
  await pointsModel.init();
  // console.log('Точки загружены:', pointsModel.getPoints());
  boardPresenter.init();
};

startApp();

