import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewsApiService from './srv';
import './sass/main.scss';
import Notiflix from 'notiflix';

const newsApi = new NewsApiService();

const refs = {
  form: document.getElementById('search-form'),
  loadMore: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};
refs.loadMore.style.display = 'none';
refs.form.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  clearArticles();
  refs.loadMore.style.display = 'none';
  newsApi.query = e.currentTarget.searchQuery.value;
  if (newsApi.query === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  newsApi.resetPage();
  newsApi.fetchImage().then(({ hits, totalHits }) => {
    if (totalHits === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
    addArticlesMarkup(hits);
    showTotalImage(totalHits);

    refs.loadMore.style.display = 'flex';
  });
}

function onLoadMore() {
  newsApi.fetchImage().then(({ hits, totalHits }) => {
    if (totalHits > hits) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMore.style.display = 'none';
    }
    addArticlesMarkup(hits);
  });
}

function addArticlesMarkup(articles) {
  refs.gallery.insertAdjacentHTML('beforeend', addCard(articles));
  const lightbox = new SimpleLightbox('.gallery a');
}

function addCard(card) {
  return card.map(
    el => `
  <div class="photo-card">
    <div class='image-thumb'>
      <a href="${el.largeImageURL}" class='link'>
        <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" width="400px" heigth="270px" class='img'/>
      </a>
    </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b> <br>${el.likes}
        </p>
        <p class="info-item">
          <b>Views</b> <br>${el.views}
        </p>
        <p class="info-item">
          <b>Comments</b> <br>${el.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b> <br>${el.downloads}
        </p>
      </div>
  </div>`,
  );
}

function clearArticles() {
  refs.gallery.innerHTML = '';
}

function errorShow() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function showTotalImage(total) {
  Notiflix.Notify.success(`"Hooray! We found ${total} images."`);
}
