import {
    GET_CONFIG_FROM_DATABASE,
    UPDATE_SLIDESHOW_DURATION,
    UPDATE_TRANSITION_DURATION

} from '../actions/admin';

export default function(state = {}, action) {
    switch (action.type) {

        case GET_CONFIG_FROM_DATABASE:
            const {
                slideDuration,
                transitionDuration,
                slideToShowWeatherOn,
                cityToShowWeatherFor
            } = action.payload;

            return {
                ...state,
                slideDuration,
                transitionDuration,
                slideToShowWeatherOn,
                cityToShowWeatherFor
            }

        case UPDATE_SLIDESHOW_DURATION:
            return {...state, slideDuration: action.payload};

        case UPDATE_TRANSITION_DURATION:
            return {...state, transitionDuration: action.payload};

        default:
            return state;

    } // switch
} // export default function
