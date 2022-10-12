import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './js/refs';
import { PixabayAPI } from './js/PixabayAPI';
import { createMarkup } from './js/createMarkup';
import { spinnerPlay, spinnerStop } from './js/spinner';

// const API_KEY = '30473634-1b924b529feef7019e04708d2';

// добавити  спінер 37 хвилина 1 уроку

const pixabay = new PixabayAPI();

var gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

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
  spinnerPlay();

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

      gallery.refresh();

      pixabay.calculateTotalPages(total);

      if (pixabay.isShowLoadMore) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }
    })
    .catch(error => {
      console.log(error);
      clearPage();
    })
    .finally(() => {
      spinnerStop();
    });
}

function onLoadMoreClik(event) {
  spinnerPlay();
  pixabay.incrementPage();
  if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }

  pixabay
    .getPhotos()
    .then(({ hits, totalHits }) => {
      const markup = createMarkup(hits);
      refs.galleryList.insertAdjacentHTML('beforeend', markup);

      gallery.refresh();

      // Notify.info(`Hooray! We found ${totalHits} images.`);
    })
    .catch(error => {
      console.log(error);
      clearPage();
    })
    .finally(() => {
      spinnerStop();
    });
}

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClik);

function clearPage() {
  pixabay.resetPage();
  refs.galleryList.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}
