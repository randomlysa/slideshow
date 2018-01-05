import {
    GET_CONFIG_FROM_LOCALSTORAGE,
    UPDATE_SLIDESHOW_DURATION

} from '../actions/index';

export default function(state = [], action) {
    switch (action.type) {
        case GET_CONFIG_FROM_LOCALSTORAGE:
            return action.payload

        case UPDATE_SLIDESHOW_DURATION:
            return {...state, slideDuration: action.payload};

        default:
            // If no state was loaded from local storage, set some defaults.
            if (state.length === 0) {
                return { 'slideDuration': 6, 'slideTransition': 1.5}
            // Otherwise return state from local storage set in index.js:
            // index.js > const persistedState = loadState();
            } else {
                return state
            }
    }

}
