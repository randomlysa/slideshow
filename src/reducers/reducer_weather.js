import {
    FETCH_WEATHER_FROM_OPENWEATHER,
    FETCH_WEATHER_UPDATE
} from '../actions/weather';

export default function(state = {}, action) {
    const now = new Date().getTime();

    switch (action.type) {
        case FETCH_WEATHER_FROM_OPENWEATHER:
            return {...action.payload, 'timeFetched': now};

        case FETCH_WEATHER_UPDATE:
            if(action.payload) {
                let updatedCity = action.payload;
                updatedCity.timeFetched = now;

                // Return state with updatedCity.
                return state.map(city => {
                    if(city.id !== action.payload.id) {
                        return city;
                    }
                    return updatedCity;
                });
            } // if(action.payload)

        default:
            return state;

    } // switch
} // export default
