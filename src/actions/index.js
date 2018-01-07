export const UPDATE_SLIDESHOW_DURATION = 'UPDATE_SLIDESHOW_DURATION';
export const UPDATE_TRANSITION_DURATION = 'UPDATE_TRANSITION_DURATION';

export function updateSlideshowDuration(duration) {
    return {
        type: UPDATE_SLIDESHOW_DURATION,
        payload: duration
    }
}

export function updateTransitionDuration(duration) {
    return {
        type: UPDATE_TRANSITION_DURATION,
        payload: duration
    }
}

