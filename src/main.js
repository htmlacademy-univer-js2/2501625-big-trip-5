import BoardPresenter from './presenter/main-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import OffersModel from './model/offer-model.js';
import DestinationsModel from './model/destination-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsApiService from './points-api-service.js';
import OffersApiService from './offers-api-service.js';
import DestinationsApiService from './destinations-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2jre341';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
// Контейнеры из DOM
const siteMainElement = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');
// Модели
const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
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
  pointsModel: pointsModel,
  filterModel: filterModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel,
});
boardPresenter.init();
const startApp = async () => {
  filterPresenter.init();
  try {
    await Promise.all([
      offersModel.init(),
      destinationsModel.init()
    ]);
    await pointsModel.init();
  } catch (error) {
    // console.warn('Ошибка загрузки данных, показываем пустой список:', error);
  }
};


startApp();

