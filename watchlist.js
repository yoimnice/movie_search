/* jshint esversion: 8 */
import { removeFromLocalStorage } from "./utils.js";

const watchlist = document.getElementById('watchlist-container');
const moviesContainer = document.getElementById('movies-container');
const localStorageName = 'watchlist';

let localStorageArray = JSON.parse(localStorage.getItem(localStorageName));

// -------------- Event Listeners -------------- //

document.addEventListener('click', (e) => {
    let removeBtn = e.target.dataset.removeWatchList;
    if(removeBtn){
        removeFromLocalStorage(localStorageArray, localStorageName, removeBtn)
        renderObject(localStorageArray);
    }
});

if(localStorageArray){
    if(localStorageArray.length >= 0){
        renderObject(localStorageArray);
    }else{
        watchlist.innerHTML = `
        <h5 class="third-font-color">Your watchlist is looking a little empty...</h5>
        <a href="index.html" style="text-decoration: none; color: var(--font-clr);">
            <h6><img src="icon/add.svg" class="me-2">Let's add some movies!</h6>
        </a>
        `;
    }
}

// -------------- Render -------------- //

function renderObject(array){
    moviesContainer.innerHTML = '';
    array.forEach(({ id, title, poster, rating, runtime, genre, plot }) =>
    moviesContainer.innerHTML += `
    <div class="container d-flex border-bottom" style="border-color: #2C2C2C !important;" id="movie-wrapper-${id}">
        <div class='col-xxl-8 d-flex bg-dark py-4' style="color: white;">
            <div class='mx-3'>
                <img src="${poster}" class="custom-img-size" loading="lazy">
            </div>
            <div class='d-flex flex-column'>
                <div class='d-flex gap-3 align-items-end'>
                    <h2 class='m-0'>${title}</h2>
                    <p class='m-0'>Rating: ${rating}</p>
                </div>
                <div class='d-flex align-items-end mt-2'>
                    <p class="m-0 me-3">${runtime}</p>
                    <p class="m-0 me-4">${genre}</p>
                    <div>
                        <p class="d-flex gap-1 m-0"><img class="remove-button" data-remove-watch-list="${id}" id="remove-from-watchlist-${id}" src='icon/remove.svg'> Remove </p>
                    </div>
                </div>
                <div class="d-flex mt-2">
                    <p style="color: var(--font-gray)">
                        ${plot}
                    </p>
                </div>
            </div>
        </div>
    </div>
    `); 
}
