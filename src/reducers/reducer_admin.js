import { DO_LOGIN, DO_LOGOUT } from '../actions/actions_admin';

export default function(state = {}, action) {
  switch (action.type) {
    case DO_LOGIN:
      return {
        token: action.payload
      };
    case DO_LOGOUT:
      return {};
    default:
      return state;
  }
}
