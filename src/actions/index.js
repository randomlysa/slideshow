export const UPDATE_SLIDESHOW_DURATION = 'UPDATE_SLIDESHOW_DURATION';

export function updateSlideshowDuration(duration) {
    return {
        type: UPDATE_SLIDESHOW_DURATION,
        payload: duration
    }
}
