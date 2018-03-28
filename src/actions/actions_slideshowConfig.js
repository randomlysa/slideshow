import $ from 'jquery';
import { API_ROOT } from '../config/api-config';

export const UPDATE_CONFIG = 'UPDATE_CONFIG';
export const GET_CONFIG_FROM_DATABASE = 'GET_CONFIG_FROM_DATABASE';
export const GET_CONFIG_FROM_DATABASE_FULFILLED = 'GET_CONFIG_FROM_DATABASE_FULFILLED';
export const UPDATE_CONFIG_IN_DATABASE = 'UPDATE_CONFIG_IN_DATABASE';
export const UPDATE_CONFIG_IN_DATABASE_FULFILLED = 'UPDATE_CONFIG_IN_DATABASE_FULFILLED';

export const SET_WEATHER_CITY = 'SET_WEATHER_CITY';
export const DELETE_FILE_FULFILLED = 'DELETE_FILE_FULFILLED';
export const UPLOAD_FILE_FULFILLED = 'UPLOAD_FILE_FULFILLED';


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

export const updateConfigInDatabase = (updateOrInsert, dataObject) => (dispatch) => {
  return new Promise(function(resolve, reject) {
    let url;
    if (updateOrInsert === 'update') url = `${API_ROOT}/php/sqliteUpdateDatabaseConfig.php`;
    if (updateOrInsert === 'insert') url = `${API_ROOT}/php/sqliteInsertDatabaseConfig.php`;

    const {
      name, // name of slideshow
      slideDuration,
      transitionDuration,
      slidesToShowWeatherOn,
      cityToShowWeatherFor,
      slideOrder
    } = dataObject;

    return $.ajax({
      url,
      type: 'POST',
      data: {
        name, // name of slideshow
        slideDuration,
        transitionDuration,
        slidesToShowWeatherOn,
        cityToShowWeatherFor,
        slideOrder
      } // data
    }) // ajax
    .then(data => {
      if (data === 'Row Inserted' || data === 'Row Updated') {
        dispatch(updateConfig(dataObject));
        return resolve();
      } else {
        return reject(data);
      }
    }) // done
    .catch(e => {
      console.log(e);
      return reject();
    }); // fail
  }); // return (dispatch)
};

// Remove deleted file from state (slideOrder)
export function updateAfterDeleteFile(filename, folder, newConfig) {
  // If delete failed, filename and folder will be null.
  const result = (filename, folder) ? 'success' : 'fail';
  return {
    type: DELETE_FILE_FULFILLED,
    result,
    filename,
    folder,
    newConfig
  }
}

// Dispatches updateAfterDeleteFile when finished.
export function deleteFile(filename, folder, typeOfUpdate, newConfig) {
  return (dispatch) => {
    $.ajax({
      context: this,
      url: `${API_ROOT}/php/deleteFile.php`,
      type: 'POST',
      data: {
        fileToDelete: filename,
        folder
      }
    }) // ajax
    .done(data => {
      if (data === "Error: file or folder not found") {
        console.log('error', data);
        dispatch(updateAfterDeleteFile(null, null));
      } else {
        console.log('file deleted', data);
        dispatch(updateConfigInDatabase(typeOfUpdate, newConfig));
        dispatch(updateAfterDeleteFile(filename, folder, newConfig));
      }
    }) // ajax done
    .fail(e => {
      dispatch(updateAfterDeleteFile(null, null));
      console.log('fail', e);
    }); // ajax fail
  }; // return (dispatch)
} // export function deleteFile

// Remove deleted file from state (slideOrder)
export function updateAfterUploadFile(newSlideOrder) {
  // If delete failed, filename and folder will be null.
  // const result = (filename, folder) ? 'success' : 'fail';
  return {
    type: UPLOAD_FILE_FULFILLED,
    slideOrder: newSlideOrder
  }
}

// Dispatches updateAfterDeleteFile when finished.
export const uploadFile = (acceptedFiles, activeFolder) => (dispatch) => {
  let slideOrder;
  let filesUploaded = [];
  let filesFailed = [];
  let uploads = [];

  return new Promise(function (resolve, reject) {
    dispatch(getConfigFromDatabase(activeFolder))
    .then(data => {
      const currentConfig = data.action.payload;
      if (slideOrder !== '') slideOrder = JSON.parse(currentConfig.slideOrder);
      else slideOrder = '';

      // https://stackoverflow.com/q/5627284/3996097 and
      // https://stackoverflow.com/a/5627301/3996097
      acceptedFiles.map(file => {
        // formData: https://stackoverflow.com/a/24939229/3996097
        var formData = new FormData();
        formData.append('photo', file);
        // Set folder to upload file to.
        formData.append('folder', activeFolder);

        uploads.push(
          $.ajax({
            url: `${API_ROOT}/php/uploadFiles.php`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false
          }) // $.ajax
          .then(data => {
            const returnMessage = JSON.parse(data)[0];
            if (returnMessage.filename) {
              filesUploaded[filesUploaded.length] = returnMessage;
              return resolve();
            // Error.
            } else {
              filesFailed[filesFailed.length] = returnMessage.filename;
              return reject(returnMessage);
            } // else
          }) // $ajax.then
          .catch((e, returnMessage) => {
            console.log(e);
            filesFailed[filesFailed.length] = returnMessage.filename;
            return reject(returnMessage);
          }) // catch
        ); // uploads.push
      }); // acceptedFiles.forEach

      // When all uploads have finished.
      $.when.apply($, uploads).done(data => {
        const newSlideOrder = JSON.stringify([...slideOrder, ...filesUploaded]);
        // Update database.
        dispatch(updateConfigInDatabase('update', {
          name: activeFolder,
          slideOrder: newSlideOrder
        }));
        // Update redux.
        dispatch(updateAfterUploadFile(newSlideOrder));
        // So UploadFiles.js > onDrop can return failed files.
        return Promise.resolve();
      }); // When all uploads have finished.

    }); // dispatch(getConfigFromDatabase(activeFolder)).then
  }); // return new Promise.
}; // export const uploadFile


export function setWeatherCity(name) {
  return {
    type: SET_WEATHER_CITY,
    payload: name[0]
  }
}
