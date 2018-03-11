import Papa from 'papaparse';
import { API_ROOT, SLIDESHOW_ROOT } from '../config/api-config';
import $ from 'jquery';

export const GET_CSV_DATA = 'GET_CSV_DATA';
export const GET_CSV_DATA_FULFILLED = 'GET_CSV_DATA_FULFILLED';

export function getCSVData(fileObject, slideshowDir) {
  const itemUrl = `${SLIDESHOW_ROOT}/slideshows/${slideshowDir}/${filename}`;
  const { filename, md5 } = fileObject;

  let loadedCsvFromDatabase, fromDBFilename, fromDBmd5;
  // Get loaded CSV from database.
  $.ajax({
    url: `${API_ROOT}/php/sqliteGetBulletinConfigByName.php?name=${slideshowDir}`,
    type: 'GET',
    dataType: 'json'
  })
  .done(data => {
    if (data.loadedCsv === "") {
      console.log('no data');
    } else {
      const jsonData = JSON.parse(data.loadedCsv)
      fromDBFilename = jsonData.filename;
      fromDBmd5 = jsonData.md5;
      console.log(fromDBFilename, fromDBmd5);
    }
  });

  // On success, save this CSV file
  const saveLoadedCsvToDatabase = function() {
    const url = `${API_ROOT}/php/sqliteUpdateDatabaseConfig.php`;
    $.ajax({
      url,
      type: 'POST',
      data: {
        name: slideshowDir,
        loadedCsv: JSON.stringify(fileObject)
      }
    })
    .done(() => {
      console.log('saved loadedCsv to database');
    })
  };


  return {
      type: GET_CSV_DATA,
      async payload() {
        return new Promise(function (fulfill, reject){
          Papa.parse(itemUrl, {
            download: true,
            complete: function (response){
              try {
                saveLoadedCsvToDatabase(),
                fulfill({
                  filename: filename,
                  data: response.data
                });
              } catch (ex) {
                reject(ex);
              }
            } // complete
          }, reject); // Papa.parse
        }); // return new Promise
      } // async payload
  }; // return
} // export function
