import Papa from 'papaparse';
import { API_ROOT, SLIDESHOW_ROOT } from '../config/api-config';
import $ from 'jquery';
import _ from 'lodash';

export const GET_CSV_DATA = 'GET_CSV_DATA';
export const GET_CSV_DATA_FULFILLED = 'GET_CSV_DATA_FULFILLED';


 // On success, save this CSV file
 const saveLoadedCsvToDatabase = function(slideshowDir, fileObject, fileObjectFromDB) {
  const url = `${API_ROOT}/php/sqliteUpdateDatabaseConfig.php`;
  let newCsvForDatabase;

  // Nothing in the database. Add fileObject to the database.
  if (!fileObjectFromDB) {
    // Make an array of one file in case new files are added later.
    const makeArray = [fileObject];
    $.ajax({
      url,
      type: 'POST',
      data: {
        name: slideshowDir,
        loadedCsv: JSON.stringify(makeArray)
      }
    })
    .done(() => {
      console.log('!fileObjectFromDB - saved loadedCsv to database');
    });
  } else {
    // Search for fileObject.filename and fileObject.md5 in database.
    const findFileInDb = _.find(fileObjectFromDB, function(o) {
      return o.filename === fileObject.filename;
    });

    const findMd5InDb = _.find(fileObjectFromDB, function(o) {
      return o.md5 === fileObject.md5;
    });

    const { filename, md5 } = fileObject;
    const fromDBFilename = fileObjectFromDB.filename;
    const fromDBmd5 = fileObjectFromDB.md5;

    if (findFileInDb && findMd5InDb) {
      console.log('~~~~~~~~~everything is the same');
    } else if (findFileInDb && !findMd5InDb) {
      console.log('~~~~~~~Filename is the same but md5 is new');
    } else if (findFileInDb === undefined) {
      console.log('~~~~~~~~~~Filename is not in the database');
      // Get existing {database info} and add the new object.
      newCsvForDatabase = [...fileObjectFromDB, fileObject];
    } else {
      console.log('~~~~~~~~~~~something something')
    }
  } // else

  // If there is new information to add, do it here.
  if(newCsvForDatabase) {
    $.ajax({
      url,
      type: 'POST',
      data: {
        name: slideshowDir,
        loadedCsv: JSON.stringify(newCsvForDatabase)
      }
    })
    .done(() => {
      console.log('saved loadedCsv to database - newCsvForDatabase');
    })
  }
};


export function getCSVData(fileObject, slideshowDir) {
  const itemUrl = `${SLIDESHOW_ROOT}/slideshows/${slideshowDir}/${filename}`;
  const { filename, md5 } = fileObject;

  let loadedCsvFromDatabase, fileObjectFromDB, fromDBFilename, fromDBmd5;
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
      fileObjectFromDB = JSON.parse(data.loadedCsv);
      console.log(fileObjectFromDB)
      fromDBFilename = fileObjectFromDB.filename;
      fromDBmd5 = fileObjectFromDB.md5;
    }
  });

  return {
      type: GET_CSV_DATA,
      async payload() {
        return new Promise(function (fulfill, reject){
          Papa.parse(itemUrl, {
            download: true,
            complete: function (response){
              try {
                // I'm counting on fileObjectFromDB to resolve faster than
                // Papa.parse - this could be a problem?
                saveLoadedCsvToDatabase(slideshowDir, fileObject, fileObjectFromDB),
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
