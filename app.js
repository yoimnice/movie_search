/* jshint esversion: 8 */

import { removeFromLocalStorage, addToLocalStorage } from "./utils.js";

const APIkey = '26ee2b21';
const filmsContainer = document.getElementById('film-container');
const searchbar = document.getElementById('searchbar');
const form = document.getElementById('search-form');
const localStorageName = 'watchlist';

let searchedMoviesArray = [];
let localStorageArray = JSON.parse(localStorage.getItem(localStorageName));


// -------------- Event Listeners -------------- //

document.addEventListener('click', (e) => {
    let removeBtn = e.target.dataset.removeWatchList;
    let addBtn = e.target.dataset.addWatchList;
    if(removeBtn){
        removeFromLocalStorage(localStorageArray, localStorageName, removeBtn);
        renderBasicAddBtnStyle(removeBtn);
    }
    if(addBtn){
        addToLocalStorage(localStorageArray, searchedMoviesArray, localStorageName, addBtn);
        renderNewAddBtnStyle(addBtn);
    }
});


if(form){
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        fetchData(searchbar.value);
    });
}

// -------------- API Fetch -------------- //

async function fetchData(movie){
    if(!movie){
        renderSearchError();
    } else {
        renderLoadingAnimation();
        try {
            const response = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=${APIkey}`);
            if (!response.ok){
                throw new Error(`Request to the server failed, please try again.`);
            }
            const data = await response.json();
            const movieIdArray = data.Search.filter(film => film.imdbID);
            const displaySearchArray = await getMovieById(movieIdArray);
            renderObject(displaySearchArray);
        } catch (error) {
            renderSearchError();
        }
    }
}
    
async function getMovieById(array){
    let displayArray = [];
    for(let movie of array){
        try {
            let id = movie.imdbID;
            const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=26ee2b21`);
            if (!res.ok){
                throw new Error('Request to the server failed, please try again.');
            }
            const data = await res.json();
            displayArray.push(data);
        } catch (error) {
            errorHandle(error);
        }
    }
    return displayArray;
}

// -------------- API Error Handling -------------- //

function errorHandle(error) {
    filmsContainer.innerHTML = '';
    filmsContainer.innerHTML = `
        <div class=" position-absolute top-50 start-50 translate-middle container gap-2  flex-column justify-content-center align-items-center text-center px-5" id="start-exploring-modal">
                <img src="icon/error.png" class="icon icon-grey">
                <h5 class="second-font-color mt-4">${error}</h5>
        </div>
    `;
}

// -------------- Local Storage Check -------------- //

function checkAlreadyAdded(id) {
    for (let i = 0; i < localStorageArray.length; i++) {
      if (localStorageArray[i].id === id) {
        return true;
      }
    }
    return false;
}

// -------------- Render Movie Functions -------------- //

function renderObject(array){
    searchedMoviesArray.length = 0;
    filmsContainer.innerHTML = '';
    array.forEach(movie =>{ 
        const movieObj= {
            id: movie.imdbID,
            title: movie.Title,
            poster: movie.Poster,
            rating: movie.imdbRating,
            runtime: movie.Runtime,
            genre: movie.Genre,
            plot: movie.Plot,
        };
        const {imdbID, Poster, Title, imdbRating, Runtime, Genre, Plot} = movie;
        searchedMoviesArray.push(movieObj);
        if(!checkAlreadyAdded(movie.imdbID)){
            filmsContainer.innerHTML += `
            <div class="container d-flex border-bottom" style="border-color: #2C2C2C !important;" id="movie-wrapper-${imdbID}">
                <div class='col-xxl-8 d-flex bg-dark py-4' style="color: white;">
                    <div class='mx-3'>
                        <img src="${Poster}" class="custom-img-size" loading="lazy">
                    </div>
                    <div class='d-flex flex-column'>
                        <div class='d-flex gap-3 align-items-end'>
                            <h2 class='m-0'>${Title}</h2>
                            <p class='m-0'>Rating: ${imdbRating}</p>
                        </div>
                        <div class='d-flex align-items-end mt-2'>
                            <p class="m-0 me-3">${Runtime}</p>
                            <p class="m-0 me-4">${Genre}</p>
                            <div id="add-btn-container-${imdbID}">
                                <p class="d-flex gap-1 m-0"><img class="add-button" data-add-watch-list="${imdbID}" id="add-to-watchlist-${movie.imdbID}" src='icon/add.svg'> Watchlist </p>
                            </div>
                        </div>
                        <div class="d-flex mt-2">
                            <p style="color: var(--font-gray)">
                                ${Plot}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            `;
        } else {
            filmsContainer.innerHTML += `
            <div class="container d-flex border-bottom" style="border-color: #2C2C2C !important;" id="movie-wrapper-${imdbID}">
                <div class='col-xxl-8 d-flex bg-dark py-4' style="color: white;">
                    <div class='mx-3'>
                        <img src="${Poster}" class="custom-img-size" loading="lazy">
                    </div>
                    <div class='d-flex flex-column'>
                        <div class='d-flex gap-3 align-items-end'>
                            <h2 class='m-0'>${Title}</h2>
                            <p class='m-0'>Rating: ${imdbRating}</p>
                        </div>
                        <div class='d-flex align-items-end mt-2'>
                            <p class="m-0 me-3">${Runtime}</p>
                            <p class="m-0 me-4">${Genre}</p>
                            <div id="add-btn-container-${imdbID}">
                                <p class="d-flex gap-1 m-0">
                                <img class="remove-button" data-remove-watch-list="${imdbID}" id="remove-from-watchlist-${imdbID}" src='icon/remove.svg'>
                                    Remove from the <a href='watchlist.html'>Watchlist</a>
                                </p>
                            </div>
                        </div>
                        <div class="d-flex mt-2">
                            <p style="color: var(--font-gray)">
                                ${Plot}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    });
}

function renderSearchError(){
    let html = '';
    html = `
        <div class=" position-absolute top-50 start-50 translate-middle container gap-2  flex-column justify-content-center align-items-center text-center px-5" id="start-exploring-modal">
                <img src="icon/error.png" class="icon icon-grey">
                <h5 class="second-font-color mt-4">Sorry, we cant find the film by this name</h5>
        </div>
    `;
    filmsContainer.innerHTML = html;
}

function renderNewAddBtnStyle(id){
    let html = '';
    html = `
    <p class="d-flex gap-1 m-0">
    <img class="remove-button" data-remove-watch-list="${id}" id="remove-from-watchlist-${id}" src='icon/remove.svg'>
        Remove from the <a href='watchlist.html'>Watchlist</a>
    </p>
    `;
    document.getElementById(`add-btn-container-${id}`).innerHTML = html;
}

function renderBasicAddBtnStyle(id){
    let html = '';
    html = `
    <p class="d-flex gap-1 m-0">
        <img class="add-button" data-add-watch-list="${id}" id="add-to-watchlist-${id}" src='icon/add.svg'>
        Watchlist 
    </p>
    `;
    document.getElementById(`add-btn-container-${id}`).innerHTML = html;
}

function renderLoadingAnimation(){
    let html = '';
    html = `
    <div class=" position-absolute top-50 start-50 translate-middle container gap-2  flex-column justify-content-center align-items-center text-center px-5" id="start-exploring-modal">
        <div class="loader loader--style1" title="0">
            <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
                <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                C22.32,8.481,24.301,9.057,26.013,10.047z">
                    <animateTransform attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 20 20"
                        to="360 20 20"
                        dur="0.5s"
                        repeatCount="indefinite"/>
                </path>
            </svg>
        </div>
        
        <h5 class="second-font-color mt-4">Loading...</h5>
    </div>
    `;
    filmsContainer.innerHTML = html;
}