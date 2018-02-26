import {
  GET_CSV_DATA
} from '../actions/csv';

export default function(state = [], action) {
  switch (action.type) {
    case GET_CSV_DATA:
      return action.payload.data;
    default:
        return state;
  }
}
