import {filter} from '../const';

export const generateFilters = (points) => Object.entries(filter).map(([filterType, filterPatternByType]) => ({
  type: filterType,
  count: filterPatternByType(points).length
}));
