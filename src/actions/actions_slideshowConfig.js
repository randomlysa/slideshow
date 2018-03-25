import $ from 'jquery';
import { API_ROOT } from '../config/api-config';
import swal from 'sweetalert2';

export const UPDATE_CONFIG = 'UPDATE_CONFIG';
export const GET_CONFIG_FROM_DATABASE = 'GET_CONFIG_FROM_DATABASE';
export const GET_CONFIG_FROM_DATABASE_FULFILLED = 'GET_CONFIG_FROM_DATABASE_FULFILLED';
export const UPDATE_CONFIG_IN_DATABASE = 'UPDATE_CONFIG_IN_DATABASE';
export const UPDATE_CONFIG_IN_DATABASE_FULFILLED = 'UPDATE_CONFIG_IN_DATABASE_FULFILLED';

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

export function updateConfig(dataObject) {
  return {
    type: UPDATE_CONFIG,
    payload: dataObject
  }; // return
} // updateConfig

export const updateConfigInDatabase = (updateOrInsert, dataObject) => {
  return (dispatch) => {
    let url;
    if (updateOrInsert === 'update') url = `${API_ROOT}/php/sqliteUpdateDatabaseConfig.php`;
    if (updateOrInsert === 'insert') url = `${API_ROOT}/php/sqliteInsertDatabaseConfig.php`;

    const {
      name, // name of slideshow
      slideDuration,
      transitionDuration,
      slidesToShowWeatherOn,
      cityToShowWeatherFor
    } = dataObject;

    $.ajax({
      url,
      type: 'POST',
      data: {
        name, // name of slideshow
        slideDuration,
        transitionDuration,
        slidesToShowWeatherOn,
        cityToShowWeatherFor
      } // data
    }) // ajax
    .done(data => {
      if (data === 'Row Inserted' || data === 'Row Updated') {
        swal({
          timer: 1500,
          toast: true,
          position: 'bottom-end',
          text: 'Changes saved!'
        });
        dispatch(updateConfig(dataObject));
      }
      else
        swal({
          timer: 3000,
          toast: true,
          type: 'error',
          text: 'There was an error saving your changes.: ' + data
        });;
    }) // done
    .fail(e => {
      console.log(e);
      swal({
        timer: 3000,
        toast: true,
        type: 'error',
        text: 'There was an error saving your changes.'
      })
    }); // fail
  } // return (dispatch)
}

export function setWeatherCity(name) {
  return {
    type: SET_WEATHER_CITY,
    payload: name[0]
  }
}
