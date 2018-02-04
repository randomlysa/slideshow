import $ from 'jquery';

export const GET_SLIDESHOW_SLIDES = 'GET_SLIDESHOW_SLIDES';

let server;

// Get list of files for slideshow.
export function updateSlideshow() {
    // const self = this;
    const origin = window.location.origin;

    if (origin.includes("http://localhost:3000")) {
      server = "http://localhost/slideshow/public" // use localhost with php
    } else {
      // Set path for ajax requests.
      // TODO: set /bulletin to be a variable.
      server = `${origin}/bulletin`;
    }

    return {
      type: GET_SLIDESHOW_SLIDES,
      // TODO: update bb1 to be a variable.
      payload: $.ajax({
        url: `${server}/php/getFiles.php?dir=bb1`,
        dataType: 'json'
        })
    } // return
} // updateSlideShow
