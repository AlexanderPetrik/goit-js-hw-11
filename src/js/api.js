import axios from 'axios';
// Ключ библиотеки axios
const KEY = '37429759-66239b447aa4c13fe873ee915';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
    return Promise.reject(error);
  },
);

export async function fetchImages(query, page, perPage) {
  try {
    const response = await axios.get(
      `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
    );
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};


