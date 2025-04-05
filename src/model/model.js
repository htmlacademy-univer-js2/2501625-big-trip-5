
import { generatePoints } from '../mock/point.js';
import { POINT_COUNT} from '../const.js';

export default class PointsModel {
  #points = generatePoints(POINT_COUNT);
  get points() {
    return this.#points;
  }
}
