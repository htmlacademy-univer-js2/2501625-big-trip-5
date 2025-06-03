import ApiService from './framework/api-service.js';

// const Method = {
//   GET: 'GET',
//   PUT: 'PUT',
// };

export default class DestinationsApiService extends ApiService {
  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }
}
