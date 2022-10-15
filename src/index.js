import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './js/refs';
import { PixabayAPI } from './js/PixabayAPI';
import { createMarkup } from './js/createMarkup';
import { spinnerPlay, spinnerStop } from './js/spinner';

const pixabay = new PixabayAPI();

var gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

async function onSubmit(event) {
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

  try {
    spinnerPlay();
    const { hits, total, totalHits } = await pixabay.getPhotos();
    if (hits.length === 0) {
      Notify.success(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    const markup = createMarkup(hits);
    refs.galleryList.insertAdjacentHTML('beforeend', markup);

    gallery.refresh();

    Notify.info(`Hooray! We found ${totalHits} images.`);
    pixabay.calculateTotalPages(total);

    if (pixabay.isShowLoadMore) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
    clearPage();
  } finally {
    spinnerStop();
  }
}

async function onLoadMoreClik(event) {
  pixabay.incrementPage();
  if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  try {
    spinnerPlay();
    const { hits } = await pixabay.getPhotos();
    const markup = createMarkup(hits);
    refs.galleryList.insertAdjacentHTML('beforeend', markup);
    skrollPage();
    gallery.refresh();
  } catch (error) {
    console.log(error);
    clearPage();
  } finally {
    spinnerStop();
  }
}

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClik);

function clearPage() {
  pixabay.resetPage();
  refs.galleryList.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}

function skrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 12,
    behavior: 'smooth',
  });
}
