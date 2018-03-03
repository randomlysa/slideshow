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
  // Todo: If no header, return all data with no sort or filter?
  // Todo: this should be a per-csv prop.
  const hasHeader = true;
  const showHeader = true;

  // Set up a time filter.
  // Format of date in CSV file. See https://momentjs.com/docs/#/parsing/string/
  const csvDateFormat = 'hh:mm:ss a';

  // For testing, set nowTime to any time using the same format.
  // Otherwise, for the actual current time,  use nowTime = moment();
  // const nowTime = moment();
  const nowTime = moment("2:34:00 PM", csvDateFormat);

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

  const filteredCsv = _.filter(thisCsv, (row, index) => {
    // Hide header if hasHeader is true and showHeader is false.
    if (hasHeader && !showHeader && index === 0) return;

    // Keeps 'time' from being added to rows that are empty.
    const joinedRow = row.join();
    if (joinedRow === '') return;

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

  // Return null (don't render the div) if no data was found.
  // Todo: Add option to return some error text instead.
  // If hasHeader and showHeader, at least the header should have been returned,
  // so one row means empty (only the header was returned.)
  // If hasHeader and not showHeader, or if not has header, no rows means empty.
  if (hasHeader && showHeader && filteredCsv.length === 1 ||
    hasHeader && !showHeader && filteredCsv.length === 0 ||
    !hasHeader && filteredCsv.length === 0) {
    return null;
  }

  const csvItems = filteredCsv.map((row, rowIndex) => {
    // Conditionally render the header (ie, it might not exist or be set to hid)
    if (rowIndex === 0 && hasHeader && showHeader) {
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
      ); // // return.
    } // end return header section.

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
    ) // return for all other rows except header.
  }) // csvItems map

  return (
    <div key={props.fileObject.filename} className="slideshowItem csvHolder rTable" style={props.style}>
      {csvItems}
    </div>
  ) // return
}

export default SlideshowItemCSV;
