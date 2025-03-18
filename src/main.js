import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchFromPixabay } from './js/pixabay-api';
import { renderMoreGallery, resetGallery } from './js/render-functions';

const refs = {
  form: document.querySelector('form'),
  loader: document.querySelector('.loader'),
  loadMoreBtn: document.querySelector('.load-more'),
};
refs.form.addEventListener('submit', onSubmit);
loaderStop();

let pageCount;
let query;

async function onSubmit(event) {
  event.preventDefault();
  const form = event.target;
  hideLoadMoreBtn();
  loaderStart();
  if (!form.elements['search-text'].value.trim()) {
    iziToast.show({
      message: 'Please, enter something for us to look for',
      title: 'Warning',
      backgroundColor: 'yellow',
      position: 'topRight',
    });
  } else {
    try {
      resetGallery();
      query = form.elements['search-text'].value;
      pageCount = 1;
      const resalt = await fetchFromPixabay(query, pageCount);
      const images = resalt.data.hits;

      loaderStop();
      if (images.length == 0) {
        iziToast.error({
          message: 'No resalt found',
          position: 'topRight',
        });
      } else {
        renderMoreGallery(images, pageCount);
        if (resalt.data.totalHits > 15) {
          showLoadMoreBtn();
        }
      }
    } catch (error) {
      console.log(error);
    }
    form.reset();
  }
}

function showLoadMoreBtn() {
  try {
    refs.loadMoreBtn.classList.remove('visually-hidden');
    refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
  } catch {
    console.log('already shown');
  }
}
function hideLoadMoreBtn() {
  try {
    refs.loadMoreBtn.removeEventListener(onLoadMoreBtnClick);
    refs.loadMoreBtn.classList.add('visually-hidden');
  } catch {
    console.log('already removed');
  }
}

async function onLoadMoreBtnClick() {
  pageCount++;
  console.log(pageCount);
  const resalt = await fetchFromPixabay(query, pageCount);
  const images = resalt.data.hits;

  renderMoreGallery(images);
  refs.card = document.querySelector('.gallery-link');
  const pixelsToScroll = refs.card.getBoundingClientRect().height * 2;

  scrollBy({
    top: pixelsToScroll,
    behavior: 'smooth',
  });

  if (pageCount == Math.ceil(resalt.data.totalHits / 15)) {
    iziToast.show({
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
      backgroundColor: 'yellow',
    });
    hideLoadMoreBtn();
  }
}

function loaderStart() {
  refs.loader.className = 'loader';
}
function loaderStop() {
  refs.loader.className = '';
}
