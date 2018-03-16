import {
    DO_LOGIN, DO_LOGOUT
} from '../actions/actions_admin';

export default function(state = {}, action) {

    // Todo: when a slideshow is running, this doesn't get 'saved' - whatever
    // the current value is, that's what gets returned.
    switch (action.type) {
        case DO_LOGIN:
            return {
                token: action.payload
            };
        case DO_LOGOUT:
            return {
                token: null
            };
        default:
            return state;
    }

}
