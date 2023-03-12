import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;
const API_KEY = '34313716-0e76e644bd8f27c835c695001';
const BASE_URL = 'https://pixabay.com/api';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchImages(loadMoreBtn) {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.perPage,
      page: this.page,
    });

    const url = `${BASE_URL}/?${searchParams}`;

    const {
      data: { hits: images, totalHits, total },
    } = await axios.get(url);

    if (images.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (this.page === 1) {
      total <= 500;
      Notify.info(`Hooray! We found ${total} images!`);
    }

    if (this.perPage * this.page >= totalHits) {
      loadMoreBtn.hide();
      Notify.info("We're sorry, but you've reached the end of search results.");
      return images;
    }

    this.incrementPage();
    loadMoreBtn.show();
    return images;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
