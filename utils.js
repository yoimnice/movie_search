/* jshint esversion: 8 */

function removeFromLocalStorage(localStorageArray, localStorageName, btn){
    for(let movie of localStorageArray){
        if(movie.id === btn){
            let index = localStorageArray.findIndex((obj) => obj === movie);
            if(index !== -1){
                localStorageArray.splice(index, 1);
                let json = JSON.stringify(localStorageArray);
                localStorage.setItem(localStorageName, json);
            }
        }
    }
}

function addToLocalStorage(localStorageArray, searchedMoviesArray, localStorageName, btn){
    for(let movie of searchedMoviesArray){
        if(btn === movie.id){
            const existingMovie = localStorageArray.find((m) => m.id === movie.id);
            if(!existingMovie){
                localStorageArray.push(movie);
                localStorage.setItem(localStorageName, JSON.stringify(localStorageArray));
            }
        }
    }
}

export {removeFromLocalStorage, addToLocalStorage};