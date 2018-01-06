import {
    UPDATE_SLIDESHOW_DURATION

} from '../actions/index';

export default function(state = {}, action) {
    switch (action.type) {

        case UPDATE_SLIDESHOW_DURATION:
            return {...state, slideDuration: action.payload}

        default:
            return state

    } // switch
} // export default function
