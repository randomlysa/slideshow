import React from 'react';
import moment from 'moment';
import _ from 'lodash';

const SlideshowItemCSV = (props) => {
  const csv = props.csvData;

  // Match file name to csv data in props.
  const match = _.findIndex(csv, function(csv) {
    return csv.file === props.item.file;
  });

  if (match === -1) return null;

  // Keep track of last occurence of 'time' since some rows have no time.
  let rowTime;
  let timeColumn;

  // rename item to row
  const csvItems = csv[match].data.map((item, index) => {

    // ["Time", "School Short Name", "GroupName", "FullCategoryName", "Room"]
    const key = item.join('_');

    // Always return the  header row because other rows will be hidden
    // later based on time.
    if (index === 0) {

      // Determine which (if any) column has the time. Used to hide events that
      // have already occured.
      timeColumn = _.findIndex(item, (o) => {
        return o.toLowerCase() === 'time';
      });

      return (
        <div key={key} className="rTableHeading">
          {item.map((column, index) => {
            return (
              <div className="rTableCell" key={column}>
                {column}
              </div>
            )
          })}
        </div>
      );
    }

    // If a row doesn't have the time, get it from the last row that had time.
    if (item[timeColumn] === "") { item[timeColumn] = rowTime; }
    // If a row has time, save that so the next row that doesn't have time
    // can use it.
    else { rowTime = item[timeColumn]; }

    // Time example: 9:35:00 AM
    const eventTime = moment(rowTime, "hh:mm:ss a");
    // const testTime = moment("10:05:00 AM", "hh:mm:ss a");
    const startTime = eventTime.clone().subtract(15, 'm');
    const endTime = eventTime.clone().add(15, 'm');
    if (eventTime.isBetween(startTime, endTime)) {
    // if (eventTime.isSameOrAfter(startTime)) {
      return (
        <div key={key} className="rTableRow">
          {item.map(column => {
            // Todo: not sure what to use for a key here.
            return (
              <div className="rTableCell">
                {column}
              </div>
            )
          })}
        </div>
      ) // return
    } // if
  }) // csvItems map
  return (
    <div key={props.item.file} className="slideshowItem csvHolder rTable" style={props.style}>
      {csvItems}
    </div>
  ) // Final return.
}

export default SlideshowItemCSV;
