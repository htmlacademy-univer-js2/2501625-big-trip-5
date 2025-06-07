import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import OffersModel from './model/offer-model.js';
import DestinationsModel from './model/destination-model.js';

import BoardPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsApiService from './api/points-api-service.js';
import OffersApiService from './api/offers-api-service.js';
import DestinationsApiService from './api/destinations-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2jre3';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const boardContainerElement = document.querySelector('.trip-events');
const filterContainerElement = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainerElement,
  filterModel,
  pointsModel,
});

const boardPresenter = new BoardPresenter({
  boardContainer: boardContainerElement ,
  filterContainer: filterContainerElement,
  pointsModel,
  filterModel,
  destinationsModel,
  offersModel,
});

boardPresenter.init();

(async () => {
  filterPresenter.init();

  await Promise.all([
    offersModel.init(),
    destinationsModel.init(),
  ]);

  await pointsModel.init();

})();
