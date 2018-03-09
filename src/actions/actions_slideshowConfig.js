import $ from 'jquery';
import { API_ROOT } from '../config/api-config';

export const GET_CONFIG_FROM_DATABASE = 'GET_CONFIG_FROM_DATABASE';
export const GET_CONFIG_FROM_DATABASE_FULFILLED = 'GET_CONFIG_FROM_DATABASE_FULFILLED';
export const SET_WEATHER_CITY = 'SET_WEATHER_CITY';

export const UPDATE_SLIDESHOW_DURATION = 'UPDATE_SLIDESHOW_DURATION';
export const UPDATE_TRANSITION_DURATION = 'UPDATE_TRANSITION_DURATION';

export function getConfigFromDatabase(name) {
  return {
    type: GET_CONFIG_FROM_DATABASE,
    payload: $.ajax({
      url: `${API_ROOT}/php/sqliteGetBulletinConfigByName.php?name=${name}`,
      type: 'GET',
      dataType: 'json'
    })
  }; // return
} // getConfigFromDatabase


export function updateSlideshowDuration(duration) {
  return {
      type: UPDATE_SLIDESHOW_DURATION,
      payload: duration
  };
}

export function updateTransitionDuration(duration) {
  return {
      type: UPDATE_TRANSITION_DURATION,
      payload: duration
  };
}

export function setWeatherCity(name) {
  return {
    type: SET_WEATHER_CITY,
    payload: name
  }
}
