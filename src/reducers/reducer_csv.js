import { GET_SLIDESHOW_SLIDES_FULFILLED } from '../actions/actions_slideshow';

import {
  GET_CSV_DATA_FULFILLED,
  UPDATE_CSV_DATA_FULFILLED
} from '../actions/actions_csv';

export default function(state = [], action) {
  switch (action.type) {
    case GET_CSV_DATA_FULFILLED:
      const { filename, data, md5 } = action.payload;
      const csv = [
        ...state,
        {
          filename,
          data,
          md5
        }
      ];
      return csv;

    case UPDATE_CSV_DATA_FULFILLED:
      console.log('new action ~~~~~~~~~', action);
    default:
      return state;
  } // switch
}
