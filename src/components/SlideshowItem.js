import React from 'react';

import SlideshowItemCSV from './SlideshowItemCSV';
import SlideshowItemImage from './SlideshowItemImage';

const SlideshowItem = (props) => {
  return (
    props.slideshowItems.files.map((item, index) => {
      let style;
      // Hide items past index 0.
      if (index > 0) style = {'display': 'none'};

      // https://stackoverflow.com/a/1203361/3996097
      const fileType = item.file.split('.').pop().toLowerCase();

      if (fileType === 'jpg') {
        return (
          <SlideshowItemImage
            key={item.file}
            dir={props.dir}
            style={style}
            item={item}
            index={index}
            props={props.slideshowItems}
          />
        )
      } // jpg

      if (fileType === 'csv' && props.slideshowItems.csv[0]) {
        return (
          <SlideshowItemCSV
            key={item.file}
            style={style}
            item={item}
            index={index}
            csvData={props.slideshowItems.csv}
          />
        );
      } // if csv
    }) // props.slideshowItems.files.map
  ); // return
} // const SlideshowItem

export default SlideshowItem;
