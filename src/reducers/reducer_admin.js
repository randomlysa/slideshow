import {
    DO_LOGIN, DO_LOGOUT
} from '../actions/actions_admin';

export default function(state = {}, action) {

    switch (action.type) {
        case DO_LOGIN:
            if(action.payload) {
              return { isLoggedIn: true };
            }
        case DO_LOGOUT:
            return {
                isLoggedIn: false
            }
        default:
            return {...state, isLoggedIn: false };
    }

}
