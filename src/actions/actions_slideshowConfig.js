import $ from 'jquery';
import { API_ROOT } from '../config/api-config';

export const GET_CONFIG_FROM_DATABASE = 'GET_CONFIG_FROM_DATABASE';
export const GET_CONFIG_FROM_DATABASE_FULFILLED = 'GET_CONFIG_FROM_DATABASE_FULFILLED';
export const SET_WEATHER_CITY = 'SET_WEATHER_CITY';

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

export function setWeatherCity(name) {
  return {
    type: SET_WEATHER_CITY,
    payload: name[0]
  }
}
