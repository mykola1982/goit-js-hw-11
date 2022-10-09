export class PixabayAPI {
  #page = 1;
  #query = '';
  #totalPages = 0;
  #perPage = 40;

  getPhotos() {
    const url = `https://pixabay.com/api/?key=30473634-1b924b529feef7019e04708d2&q=${
      this.#query
    }&
    image_type=photo&page=${this.#page}&per_page=${
      this.#perPage
    }&orientation=horizontal&safesearch=true`;

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
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
