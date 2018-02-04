import $ from 'jquery';
import { API_ROOT } from '../api-config';

export const GET_SLIDESHOW_SLIDES = 'GET_SLIDESHOW_SLIDES';

// Get list of files for slideshow.
export function updateSlideshow() {
    return {
      type: GET_SLIDESHOW_SLIDES,
      // TODO: update bb1 to be a variable.
      payload: $.ajax({
        url: `${API_ROOT}/php/getFiles.php?dir=bb1`,
        dataType: 'json'
        })
    } // return
} // updateSlideShow
