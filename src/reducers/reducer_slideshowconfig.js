import {
    GET_CONFIG_FROM_DATABASE_FULFILLED,
    SET_WEATHER_CITY,
    UPDATE_CONFIG,
    DELETE_FILE_FULFILLED
} from '../actions/actions_slideshowConfig';

export default function(state = {}, action) {
    switch (action.type) {
        case UPDATE_CONFIG:
            const config = action.payload;
            let newSlideOrder = JSON.parse(config.slideOrder);
            return {...config, slideOrder: newSlideOrder};

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
                    slideOrder: {}
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

            newSlideOrder = JSON.parse(slideOrder)

            return {
                ...state,
                slideDuration,
                transitionDuration,
                slidesToShowWeatherOn,
                cityToShowWeatherFor,
                loadedCsv,
                slideOrder: newSlideOrder
            }
        case SET_WEATHER_CITY:
            return {...state, cityToShowWeatherFor: action.payload};

        case DELETE_FILE_FULFILLED:
            if (action.result === 'fail') return state;
            const { newConfig } = action;
            newSlideOrder = JSON.parse(newConfig.slideOrder);
            return {...action.newConfig, slideOrder: newSlideOrder}

        default:
            return state;

    } // switch
} // export default function
