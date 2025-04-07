// import Presenter from './presenter/main-presenter.js';
import BoardPresenter from './presenter/1.js';
import PointsModel from './model/model.js';


new BoardPresenter({ pointsModel: new PointsModel() }).init();
