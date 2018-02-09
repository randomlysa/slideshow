export const UPDATE_SLIDESHOW_DURATION = 'UPDATE_SLIDESHOW_DURATION';
export const UPDATE_TRANSITION_DURATION = 'UPDATE_TRANSITION_DURATION';
export const VERIFY_PASSWORD = 'VERIFY_PASSWORD';

export function updateSlideshowDuration(duration) {
    return {
        type: UPDATE_SLIDESHOW_DURATION,
        payload: duration
    };
}

export function updateTransitionDuration(duration) {
    return {
        type: UPDATE_TRANSITION_DURATION,
        payload: duration
    };
}

export function checkPassword(password) {
    if (password === "14400") {
        return {
            type: VERIFY_PASSWORD,
            payload: true
        };
    } else {
        return {
            type: VERIFY_PASSWORD,
            payload: false,
            passwordEntered: Boolean((password))
        };
    }
}

export function logout() {
    return {
        type: VERIFY_PASSWORD,
        payload: false
    };
}
