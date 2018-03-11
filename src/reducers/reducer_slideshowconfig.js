import {
    GET_CONFIG_FROM_DATABASE_FULFILLED,
    SET_WEATHER_CITY,
    UPDATE_SLIDESHOW_DURATION,
    UPDATE_TRANSITION_DURATION

} from '../actions/actions_slideshowConfig';

export default function(state = {}, action) {
    switch (action.type) {
        case GET_CONFIG_FROM_DATABASE_FULFILLED:
            const {
                slideDuration,
                transitionDuration,
                slidesToShowWeatherOn,
                cityToShowWeatherFor,
                loadedCsv,
                slideOrder
            } = action.payload;

            return {
                ...state,
                slideDuration,
                transitionDuration,
                slidesToShowWeatherOn,
                cityToShowWeatherFor,
                loadedCsv,
                slideOrder
            }
        case SET_WEATHER_CITY:
            return {...state, cityToShowWeatherFor: action.payload};
        case UPDATE_SLIDESHOW_DURATION:
            return {...state, slideDuration: action.payload};

        case UPDATE_TRANSITION_DURATION:
            return {...state, transitionDuration: action.payload};

        default:
            return state;

    } // switch
} // export default function
