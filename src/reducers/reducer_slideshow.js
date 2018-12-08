import { GET_SLIDESHOW_SLIDES_FULFILLED } from '../actions/actions_slideshow';

import {
  GET_CSV_DATA_FULFILLED,
  UPDATE_CSV_DATA_FULFILLED
} from '../actions/actions_csv';

export default function(state = { dir: '', files: {} }, action) {
  switch (action.type) {
    case GET_SLIDESHOW_SLIDES_FULFILLED:
      return {
        ...state,
        dir: action.payload.dir,
        files: action.payload.files
      };
    default:
      return state;
  } // switch
}
