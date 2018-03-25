import {
    GET_CONFIG_FROM_DATABASE_FULFILLED,
    SET_WEATHER_CITY,
    UPDATE_CONFIG
} from '../actions/actions_slideshowConfig';

export default function(state = {}, action) {
    switch (action.type) {
        case UPDATE_CONFIG:
            return action.payload;

        case GET_CONFIG_FROM_DATABASE_FULFILLED:
            // If nothing has been configured in the database for this
            // slideshow, action.payload will be undefined.
            if (action.payload === undefined) {
                return {
                    slideDuration: '',
                    transitionDuration: '',
                    slidesToShowWeatherOn: '',
                    cityToShowWeatherFor: '',
                    loadedCsv: '',
                    slideOrder: ''
                };
            }

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
        default:
            return state;

    } // switch
} // export default function
