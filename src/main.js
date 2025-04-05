import Presenter from './presenter/main-presenter.js';
import PointsModel from './model/model.js';

new Presenter({ pointsModel: new PointsModel() }).init();
