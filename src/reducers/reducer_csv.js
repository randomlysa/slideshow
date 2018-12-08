import { GET_SLIDESHOW_SLIDES_FULFILLED } from '../actions/actions_slideshow';

import {
  GET_CSV_DATA_FULFILLED,
  UPDATE_CSV_DATA_FULFILLED
} from '../actions/actions_csv';

export default function(state = [], action) {
  switch (action.type) {
    case GET_CSV_DATA_FULFILLED:
      const csv = [
        ...state,
        {
          filename: action.payload.filename,
          data: action.payload.data
        }
      ];
      return csv;

    case UPDATE_CSV_DATA_FULFILLED:
      console.log('new action ~~~~~~~~~', action);
    default:
      return state;
  } // switch
}
