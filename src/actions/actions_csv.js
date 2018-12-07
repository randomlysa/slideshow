import Papa from 'papaparse';
import { API_ROOT, SLIDESHOW_ROOT } from '../config/api-config';
import $ from 'jquery';
import _ from 'lodash';

export const GET_CSV_DATA = 'GET_CSV_DATA';
export const GET_CSV_DATA_FULFILLED = 'GET_CSV_DATA_FULFILLED';

export function getCSVData(fileObject, slideshowDir) {
  const { filename, md5 } = fileObject;
  const itemUrl = `${SLIDESHOW_ROOT}/slideshows/${slideshowDir}/${filename}`;

  let fileObjectFromDB, fromDBFilename, fromDBmd5;
  // Get loaded CSV from database.
  $.ajax({
    url: `${API_ROOT}/php/sqliteGetBulletinConfigByName.php?name=${slideshowDir}`,
    type: 'GET',
    dataType: 'json'
  }).done(data => {
    if (!data) {
      console.log('no data');
    } else {
      fileObjectFromDB = JSON.parse(data.loadedCsv);
      console.log(fileObjectFromDB);
      fromDBFilename = fileObjectFromDB.filename;
      fromDBmd5 = fileObjectFromDB.md5;
    }
  });

  return {
    type: GET_CSV_DATA,
    async payload() {
      return new Promise(function(fulfill, reject) {
        Papa.parse(
          itemUrl,
          {
            download: true,
            complete: function(response) {
              try {
                fulfill({
                  filename: filename,
                  data: response.data
                });
              } catch (ex) {
                reject(ex);
              }
            } // complete
          },
          reject
        ); // Papa.parse
      }); // return new Promise
    } // async payload
  }; // return
} // export function
