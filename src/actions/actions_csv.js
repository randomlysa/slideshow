import Papa from 'papaparse';
import { API_ROOT, SLIDESHOW_ROOT } from '../config/api-config';
import $ from 'jquery';
import _ from 'lodash';

export const GET_CSV_DATA = 'GET_CSV_DATA';
export const GET_CSV_DATA_FULFILLED = 'GET_CSV_DATA_FULFILLED';

export function getCSVData(fileObject, slideshowDir) {
  const { filename, md5 } = fileObject;
  const itemUrl = `${SLIDESHOW_ROOT}/slideshows/${slideshowDir}/${filename}`;

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
                  filename,
                  md5,
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
