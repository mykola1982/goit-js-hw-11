import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '30473634-1b924b529feef7019e04708d2';

export class PixabayAPI {
  #page = 1;
  #query = '';
  #totalPages = 0;
  #perPage = 40;

  #params = {
    params: {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    },
  };

  async getPhotos() {
    const url = `?key=${API_KEY}&q=${this.#query}&
    image_type=photo&page=${this.#page}`;

    const { data } = await axios.get(url, this.#params);
    return data;
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  incrementPage() {
    this.#page += 1;
  }
  resetPage() {
    this.#page = 1;
  }

  calculateTotalPages(total) {
    this.#totalPages = Math.ceil(total / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }
}
