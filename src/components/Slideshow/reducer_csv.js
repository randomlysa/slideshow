import _ from 'lodash';

import {
  GET_CSV_DATA_FULFILLED,
  UPDATE_CSV_DATA_FULFILLED
} from './actions_csv';

export default function(state = [], action) {
  switch (action.type) {
    case GET_CSV_DATA_FULFILLED:
      let { filename, data, md5 } = action.payload;
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
      const newData = action.payload.data;
      // if no data or md5, return
      if (!newData || !action.payload.md5) return;

      const updateThis = _.find(state, { filename: action.payload.filename });
      return state.map(fileobj => {
        if (fileobj.filename === updateThis.filename) {
          // Do I need to update the MD5?
          return { ...updateThis, data: newData };
        } else {
          return fileobj;
        }
      });

    default:
      return state;
  } // switch
}
