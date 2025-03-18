import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  gallery: document.querySelector('.gallery'),
};

let galleryView = new SimpleLightbox('a.gallery-link', {
  captionDelay: 250,
  captionsData: 'alt',
});

function createImageTemplate(image) {
  const imageTags = image.tags.slice(0, 20 + image.tags.slice(20).indexOf(','));
  return `<li class="gallery-item">
  <a class="gallery-link" href="${image.largeImageURL}">
    <img
      class="gallery-image"
      src="${image.webformatURL}"
      alt="${imageTags}"
    />
    <ul class="info-list">
    <li class="photo-info" data-likes>Likes<span>${image.likes}</span></li>
    <li class="photo-info" data-views>Views<span>${image.views}</span></li>
    <li class="photo-info" data-comments>Comments<span>${image.comments}</span></li>
    <li class="photo-info" data-downloads>Downloads<span>${image.downloads}</span></li>
    </ul>
  </a>
</li>`;
}

export function renderMoreGallery(images) {
  const galeryContent = images.reduce(
    (acc, image) => acc + createImageTemplate(image),
    ''
  );
  refs.gallery.insertAdjacentHTML('beforeend', galeryContent);
  galleryView.refresh();
}

export function resetGallery() {
  refs.gallery.innerHTML = '';
  galleryView.refresh();
}
