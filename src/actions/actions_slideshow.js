import $ from 'jquery';
import { API_ROOT } from '../config/api-config';

export const GET_SLIDESHOW_SLIDES = 'GET_SLIDESHOW_SLIDES';
export const GET_SLIDESHOW_SLIDES_FULFILLED = 'GET_SLIDESHOW_SLIDES_FULFILLED';

// Get list of files for slideshow.
export function getFilesInSlideshowDir(whichSlideshow) {
    return {
        type: GET_SLIDESHOW_SLIDES,
        async payload() {
            const result = await $.ajax({
                url: `${API_ROOT}/php/getFiles.php?dir=${whichSlideshow}`,
                dataType: 'json'
            })
            return {dir: whichSlideshow, files: result}
        }

    }; // return
} // getFilesInSlideshowDir
