const DEBOUNCE_DELAY = 500;

import './sass/main.scss';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchSearch } from './srv.js';
import { createMarkup } from './srv.js';

const formRef = document.querySelector('#search-form');
const inputRef = document.querySelector('.input');
const galleryRef = document.querySelector('.gallery');
const btnMoreRef = document.querySelector('[type="button"]');

let page = 1;
const getData = (keyWord, page) => {
  fetchSearch(keyWord, page)
    .then(data => {
      const { hits, totalHits } = data;
      if (!totalHits) {
        throw new Error('');
      }
      const markup = createMarkup(hits);
      galleryRef.insertAdjacentHTML('beforeend', markup);
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      btnMoreRef.classList.remove('is-hidden');

      return;
    })

    .catch(err =>
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again`,
      )(err),
    );
};

const getImage = e => {
  e.preventDefault();
  const keyWord = inputRef.value;

  if (!keyWord) {
    galleryRef.innerHTML = ' ';
    return;
  }
  page = 1;
  getData(keyWord, page);
};

const onLoadMore = () => {
  page += 1;
  getData(inputRef.value, page);
  if (page > 40) {
    Notiflix.Notify.info('We are sorry, but you have reached the end of search results.');
    btnMoreRef.classList.add('is-hidden');
  }
};

formRef.addEventListener('submit', getImage);
btnMoreRef.addEventListener('click', onLoadMore);
