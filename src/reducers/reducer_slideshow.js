import {
    GET_SLIDESHOW_SLIDES
} from '../actions/slideshow';

import {
    GET_CSV_DATA
} from '../actions/csv';

export default function(state = [], action) {
    switch (action.type) {
        case GET_SLIDESHOW_SLIDES:
            return {...state, files: action.payload };
        case GET_CSV_DATA:
            return {...state, csv: action.payload.data };
        default:
            return state;
    }
}
