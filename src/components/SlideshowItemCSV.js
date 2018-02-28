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

  const csvItems = csv[match].data.map((item, index) => {

    // ["Time", "School Short Name", "GroupName", "FullCategoryName", "Room"]
    const key = item.join('_');

    // Always return the  header row because other rows will be hidden
    // later based on time.
    if (index === 0) {
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

    // If item[0] isn't set, get time from rowTime varaible.
    if (item[0] === "") { item[0] = rowTime; }
    // Otherwise, time is set, so set rowTime to be item[0].
    else { rowTime = item[0]; }

    // Time example: 9:35:00 AM
    const eventTime = moment(rowTime, "hh:mm:ss a");
    const testTime = moment("10:05:00 AM", "hh:mm:ss a");
    if (eventTime.isSameOrAfter(testTime)) {
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
