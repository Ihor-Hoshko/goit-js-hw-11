import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

const API_KEY = '24484314-ee5138bfa536a1ec729b18d47';
axios.defaults.baseURL = 'https://pixabay.com/api/';

const fetchSearch = async (data, page) => {
  const result = await axios.get(
    `?key=${API_KEY}&q=${data}&imageType=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`,
  );
  const { hits, totalHits } = result.data;

  return { hits, totalHits };
};

const createMarkup = images => {
  const markup = images
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads, previewWidth, largeImageURL }) => {
        return ` <div class="gallery">
  <a href="largeImageURL"
    ><img src="webformatURL" alt="" title="" />
    <div
      class="photo-card"
      style="border: 1px solid #009688; border-radius: 4px; margin-bottom: 5px"
    >
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width="260px" height="150px" />
      <div class="info">
        <p class="info-item">
          <b> Likes: ${likes}</b>
        </p>
        <p class="info-item">
          <b> Views: ${views}</b>
        </p>
        <p class="info-item">
          <b> Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b> Downloads: ${downloads}</b>
        </p>
      </div>
    </div></a
  >
</div>`;
      },
    )
    .join('');
  return markup;
};

export { fetchSearch, createMarkup };
