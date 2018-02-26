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
          <div key={item.file} className="imageHolder">
            <img src={itemUrl} alt="Slideshow Item" />
          </div>
        )
      } // jpg
      if (fileType === 'csv' && props.slideshowItems.csv) {

        // Keep track of last occurence of 'time' since some rows have no time.
        let currentTime = '';
        const csvItems = props.slideshowItems.csv.map((item) => {
          // ["Time", "School Short Name", "GroupName", "FullCategoryName", "Room"]
          const key = item.join('_');

          // If item[0] isn't set, get time from currentTime varaible.
          if (item[0] === "") {
            item[0] = currentTime;
          // Otherwise, time is set, so set currentTime to be item[0].
          } else {
            currentTime = item[0];
          }

          // Time example: 9:35:00 AM
          const eventTime = moment(currentTime, "hh:mm:ss a");
          const testTime = moment("11:00:00 AM", "hh:mm:ss a");
          console.log(eventTime.isBefore(testTime));

          return (
            <div key={key}>
              <span>{item[0]}</span>
              <span>{item[1]}</span>
              <span>{item[2]}</span>
              <span>{item[3]}</span>
              <span>{item[4]}</span>
            </div>
          );
          // console.log(item);
        })
        return (
          <div key={item.file} className="csvHolder">
            {csvItems}
          </div>
        )
      } // csv
    })
  );
} // const SlideshowItem

export default SlideshowItem;
