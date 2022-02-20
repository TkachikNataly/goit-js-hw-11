import './css/style.css';
import gallery from './template/imageGallery.hbs';
import Notiflix from 'notiflix';
import { getImages } from './api/api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';



const formRef = document.querySelector('.search-form');
const galRef = document.querySelector('.gallery');
const loadBtnRef = document.querySelector('.load-more');

let dataInput = "";
let page = 1;
let timeIde = null;

formRef.addEventListener('submit', onFormSubmit);
formRef.addEventListener('input', onInput);
loadBtnRef.addEventListener('click', onLoadMore);
// loadBtnRef.addEventListener('click', onLoadMore);
loadBtnRef.hidden = true;


function onFormSubmit(e) {
    e.preventDefault();
    loadBtnRef.hidden = true;
    galRef.innerHTML = '';

    if (dataInput !== '') {
        getImages(dataInput)
            .then(getGallery)
            .catch(noResult);
    }
    page = 1;
}

function onInput(e) {
    dataInput = e.target.value.trim();
}

function getGallery(images) {
    clearInterval(timeIde);
    if (images.totalHits === 0) {
        noResult(images);
    }
    else {
        imgMarkup(images);
        loadBtnRef.hidden = false;

        if (images.hits.length < 40) {
            endMessage();
            loadBtnRef.hidden = true;
        }
    }

    if (page === 1 & images.totalHits > 0) {
        responseMessage(images);
    }
}


function imgMarkup(images) {
    images.hits.map(image => {
        galRef.insertAdjacentHTML('beforeend', gallery(image));
    })
    let lightbox = new SimpleLightbox('.photo-card a');
    lightbox.on('show.simplelightbox', function () { });
    lightbox.refresh();
}


function onLoadMore() {
    page += 1;
    getImages(dataInput, page)
        .then(images => {
            getGallery(images);
            smothScroll();
        })
        .catch(responseMessage);
}
function smothScroll() {
    const { height: cardHeight } = galRef
        .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smoth'

    });
}

function noResult() {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
}

function responseMessage(images) {
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
}
function endMessage() {
    timeIde = setTimeout(() => {
         Notiflix.Notify.warning("We\'re sorry, but you\'ve reached the end of search results.")
    }, 200)
}
