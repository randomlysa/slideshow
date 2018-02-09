import $ from 'jquery';
import { API_ROOT } from '../api-config';

export const GET_SLIDESHOW_SLIDES = 'GET_SLIDESHOW_SLIDES';

// Get list of files for slideshow.
export function updateSlideshow(whichSlideshow) {
    return {
      type: GET_SLIDESHOW_SLIDES,
      payload: $.ajax({
        url: `${API_ROOT}/php/getFiles.php?dir=${whichSlideshow}`,
        dataType: 'json'
        })
    }; // return
} // updateSlideShow
