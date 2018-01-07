import {
    UPDATE_SLIDESHOW_DURATION,
    UPDATE_TRANSITION_DURATION

} from '../actions/index';

export default function(state = {}, action) {
    switch (action.type) {

        case UPDATE_SLIDESHOW_DURATION:
            return {...state, slideDuration: action.payload}

        case UPDATE_TRANSITION_DURATION:
            return {...state, transitionDuration: action.payload}

        default:
            return state

    } // switch
} // export default function
