import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './js/refs';
import { PixabayAPI } from './js/PixabayAPI';
import { createMarkup } from './js/createMarkup';

// const API_KEY = '30473634-1b924b529feef7019e04708d2';

const pixabay = new PixabayAPI();

function onSubmit(event) {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    Notify.failure('Enter data to search!!!');
    return;
  }
  pixabay.query = query;

  clearPage();

  pixabay
    .getPhotos()
    .then(({ hits, total }) => {
      if (hits.length === 0) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      const markup = createMarkup(hits);
      refs.galleryList.insertAdjacentHTML('beforeend', markup);

      pixabay.calculateTotalPages(total);

      if (pixabay.isShowLoadMore) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }
    })
    .catch(error => {
      console.log(error);
      clearPage();
    });
}

function onLoadMoreClik(event) {
  pixabay.incrementPage();
  if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }

  pixabay
    .getPhotos()
    .then(({ hits }) => {
      const markup = createMarkup(hits);
      refs.galleryList.insertAdjacentHTML('beforeend', markup);
    })
    .catch(error => {
      console.log(error);
      clearPage();
    });
}

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClik);

function clearPage() {
  pixabay.resetPage();
  refs.galleryList.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}
