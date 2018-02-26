import React from 'react';
import moment from 'moment';

const SlideshowItem = (props) => {
  return (
    props.slideshowItems.files.map((item, index) => {
      // https://stackoverflow.com/a/1203361/3996097
      const fileType = item.file.split('.').pop();
      if (fileType === 'jpg') {
        const itemUrl = `${props.slideshowRoot}/slideshows/${props.dir}/${item.file}`;
        return (
          <div key={item.file} className="slideshowItem imageHolder">
            <img src={itemUrl} alt="Slideshow Item" />
          </div>
        )
      } // jpg
      if (fileType === 'csv' && props.slideshowItems.csv) {
        // Keep track of last occurence of 'time' since some rows have no time.
        let rowTime;

        const csvItems = props.slideshowItems.csv.map((item, index) => {
          // ["Time", "School Short Name", "GroupName", "FullCategoryName", "Room"]
          const key = item.join('_');

          // Always return the  header row because other rows will be hidden
          // later based on time.
          if (index === 0) {
            return (
              <div key={key}>
                <span>{item[0]}</span>
                <span>{item[1]}</span>
                <span>{item[2]}</span>
                <span>{item[3]}</span>
                <span>{item[4]}</span>
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
              <div key={key}>
                <span>{item[0]}</span>
                <span>{item[1]}</span>
                <span>{item[2]}</span>
                <span>{item[3]}</span>
                <span>{item[4]}</span>
              </div>
            ) // return
          } // if
        }) // csvItems map
        return (
          <div key={item.file} className="slideshowItem csvHolder">
            {csvItems}
          </div>
        ) // Final return.
      } // if csv
    }) // props.slideshowItems.files.map
  ); // return
} // const SlideshowItem

export default SlideshowItem;
