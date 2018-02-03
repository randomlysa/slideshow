import {
    VERIFY_PASSWORD
} from '../actions/admin';

export default function(state = {}, action) {

    switch (action.type) {
        case VERIFY_PASSWORD:
            if(action.payload) {
              return { isLoggedIn: true }
            }
            else {
              return { isLoggedIn: false }
            }
        default:
            // Lets persisted state load.
            return state
    }

}
