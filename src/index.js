import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/api';
import { renderGallery } from './js/render';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

let query = '';
let totalPages = Infinity;
let page = 1;
let stopInfiniteScroll = false;
const perPage = 40;
let lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', onSearchForm);

async function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.',
    );
    return;
  }
  stopInfiniteScroll = true;
  try {
    const data = await fetchImages(query, page, perPage)
    if (data.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else {
        renderGallery(data.hits, gallery);
        lightbox.refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        totalPages = Math.ceil(data.total / perPage);
      }
  } catch (error) {
      console.log(error)
  } finally {
    searchForm.reset();
    stopInfiniteScroll = false;
  }
}

async function onLoadMore() {
  page += 1;

  stopInfiniteScroll = true;
  if (page > totalPages) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results.",
    );
    return;
  }
  try {
    const data = await fetchImages(query, page, perPage)
    renderGallery(data.hits, gallery);
      lightbox.refresh();
  } catch (error) {
    console.log(error)
  } finally {
    stopInfiniteScroll = false
  }
}

function checkIfEndOfPage() {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
}

// Выполняеться, если пользователь дошел до конца страницы
function showLoadMorePage() {
  if (!stopInfiniteScroll && checkIfEndOfPage()) {
    onLoadMore();
  }
}

// Добапвляем событие на скрол страницы, которая вызывает функцию showLoadMorePage
window.addEventListener('scroll', showLoadMorePage);

