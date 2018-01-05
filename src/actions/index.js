import { loadState } from '../manageLocalStorage';

export const GET_CONFIG_FROM_LOCALSTORAGE = 'GET_CONFIG_FROM_LOCALSTORAGE';
export const UPDATE_SLIDESHOW_DURATION = 'UPDATE_SLIDESHOW_DURATION';


export function getConfigFromLocalStorage() {
    const request = loadState() || [];

    return {
        type: GET_CONFIG_FROM_LOCALSTORAGE,
        payload: request
    }
}


export function updateSlideshowDuration(duration) {
    return {
        type: UPDATE_SLIDESHOW_DURATION,
        payload: duration
    }
}
