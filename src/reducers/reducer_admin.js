import {
    DO_LOGIN, DO_LOGOUT
} from '../actions/actions_admin';

export default function(state = {}, action) {

    switch (action.type) {
        case DO_LOGIN:
            if(action.payload) {
              return {
                  token: action.payload,
                  isLoggedIn: true
                };
            } else {
                return state;
            }
        case DO_LOGOUT:
            return {
                token: null,
                isLoggedIn: false
            }
        default:
            return state
    }

}
