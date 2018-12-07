import { GET_SLIDESHOW_SLIDES_FULFILLED } from '../actions/actions_slideshow';

import { GET_CSV_DATA_FULFILLED } from '../actions/actions_csv';

export default function(state = { dir: '', files: {}, csv: [] }, action) {
  switch (action.type) {
    case GET_SLIDESHOW_SLIDES_FULFILLED:
      return {
        ...state,
        dir: action.payload.dir,
        files: action.payload.files
      };
    case GET_CSV_DATA_FULFILLED:
      const csv = [
        ...state.csv,
        {
          filename: action.payload.filename,
          data: action.payload.data
        }
      ];
      return { ...state, csv };
    default:
      return state;
  } // switch
}
