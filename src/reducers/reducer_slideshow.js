import {
    GET_SLIDESHOW_SLIDES_FULFILLED
} from '../actions/actions_slideshow';

import {
    GET_CSV_DATA_FULFILLED
} from '../actions/actions_csv';

export default function(state = {files: {}, csv: []}, action) {

    switch (action.type) {
        case GET_SLIDESHOW_SLIDES_FULFILLED:
            return {...state, files: action.payload };
        case GET_CSV_DATA_FULFILLED:
            const csv = [
                ...state.csv,
                {
                    file: action.payload.file,
                    data: action.payload.data
                }
            ];
            return {...state, csv};
        default:
            return state;
    } // switch
}
