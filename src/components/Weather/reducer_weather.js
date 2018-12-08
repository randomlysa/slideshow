import {
  FETCH_WEATHER_FROM_LOCALSTORAGE,
  FETCH_WEATHER_FROM_OPENWEATHER_FULFILLED,
  FETCH_WEATHER_UPDATE,
  DELETE_ONE_CITY
} from './actions_weather';
import _ from 'lodash';

export default function(state = {}, action) {
  const now = new Date().getTime();

  switch (action.type) {
    case FETCH_WEATHER_FROM_LOCALSTORAGE:
      //  May return null if localstorage is empty/disabled, etc.
      if (action.payload) {
        return action.payload;
      } else {
        return state;
      }
    case FETCH_WEATHER_FROM_OPENWEATHER_FULFILLED:
      // Copy payload.data (new city) to new object.
      let newCityObject = Object.assign({}, action.payload.data);
      newCityObject.timeFetched = now;
      return newCityObject;
    case FETCH_WEATHER_UPDATE:
      if (action.payload) {
        let updatedCity = action.payload.data;
        updatedCity.timeFetched = now;

        // Return state with updatedCity.
        return state.map(city => {
          if (city.id !== action.payload.data.id) {
            return city;
          } else {
            return updatedCity;
          }
        }); // return state.map(city)
      } else {
        return state;
      }
    case DELETE_ONE_CITY:
      if (action.payload) {
        return _.reject(state, { id: parseInt(action.payload, 10) });
      } else {
        return state;
      }
    default:
      return state;
  } // switch
}
