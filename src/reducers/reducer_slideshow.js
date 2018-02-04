import {
    GET_SLIDESHOW_SLIDES
} from '../actions/slideshow';

export default function(state = [], action) {

    switch (action.type) {
        case GET_SLIDESHOW_SLIDES:
            return action.payload;

        default:
            return state;
    }

}
