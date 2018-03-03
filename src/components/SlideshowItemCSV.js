import React from 'react';
import moment from 'moment';
import _ from 'lodash';

const SlideshowItemCSV = (props) => {
  // This component doesn't know when it's active. It returns data that matches
  // a filename to loaded csv data that is rendered into a div. Slideshow.js
  // then loop()s over the divs.

  // CSV data for all files is loaded into props.csvData.
  const csv = props.csvData;

  // Match file name to csv data in props.
  const match = _.findIndex(csv, function(csv) {
    return csv.filename === props.fileObject.filename;
  });

  if (match === -1) return null;

  // CSV data for this file.
  const thisCsv= csv[match].data;

  // Set up a time filter.
  // Format of date in CSV file. See https://momentjs.com/docs/#/parsing/string/
  const csvDateFormat = 'hh:mm:ss a';

  // For testing, set nowTime to any time using the same format.
  // Otherwise, for the actual current time,  use nowTime = moment();
  // const nowTime = moment();
  const nowTime = moment("11:55:00 PM", csvDateFormat);

  // Show events for this time range from nowTime.
  const startTime = nowTime.clone().subtract(15, 'm');
  const endTime = nowTime.clone().add(5, 'm');

  // Save which column has the time.
  let timeColumn;
  // Keep track of last occurence of 'time' if some rows have no time.
  let rowTime;
  // Determine which (if any) column has the time. Used to hide events that
  // have already occured.
  timeColumn = _.findIndex(thisCsv[0], (o) => {
    return o.toLowerCase() === 'time';
  });

  const filteredCsv = _.filter(thisCsv, (row) => {
    // If a row doesn't have the time, get it from the last row that had time.
    if (row[timeColumn] === "") { row[timeColumn] = rowTime; }
    // If a row has time, save that so the next row that doesn't have time
    // can use it.
    else { rowTime = row[timeColumn]; }

    const eventTime = moment(row[timeColumn], csvDateFormat);

    // A different filter.
    // if (eventTime.isSameOrAfter(startTime)) {
    if (eventTime.isBetween(startTime, endTime, null, [])) {
      return row;
    }
  });
  // End filter.

  const csvItems = filteredCsv.map((row, rowIndex) => {

    // Always return the  header row because other rows will be hidden
    // later based on time.
    if (rowIndex === 0) {

      return (
        <div key={rowIndex} className="rTableHeading">
          {row.map((column, columnIndex) => {
            return (
              <div className="rTableCell" key={column}>
                {column}
              </div>
            )
          })}
        </div>
      );
    }

    return (
      <div key={rowIndex} className="rTableRow">
        {row.map((column, columnIndex) => {
          const columnKey = `${rowIndex}_${columnIndex}`;
          return (
            <div className="rTableCell" key={columnKey}>
              {column}
            </div>
          )
        })}
      </div>
    ) // return

  }) // csvItems map
  return (
    <div key={props.fileObject.filename} className="slideshowItem csvHolder rTable" style={props.style}>
      {csvItems}
    </div>
  ) // Final return.
}

export default SlideshowItemCSV;
