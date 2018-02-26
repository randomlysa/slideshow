import Papa from 'papaparse';
import { SLIDESHOW_ROOT } from '../config/api-config';

export const GET_CSV_DATA = 'GET_CSV_DATA';

export function getCSVData(file, slideshowDir) {
  const itemUrl = `${SLIDESHOW_ROOT}/slideshows/${slideshowDir}/${file.file}`;

  function getcsvData(itemUrl){
    return new Promise(function (fulfill, reject){
      Papa.parse(itemUrl, {
        download: true,
        complete: function (res){
          try {
            fulfill(res);
          } catch (ex) {
            reject(ex);
          }
        }
      }, reject);
    });
  }

  const data = getcsvData(itemUrl);

  return {
      type: GET_CSV_DATA,
      payload: data
  };
}
