import React from 'react';

import SlideshowItemCSV from './SlideshowItemCSV';
import SlideshowItemImage from './SlideshowItemImage';

const SlideshowItem = props => {
  return props.slideshowItems.map((fileObject, index) => {
    let style;
    // Hide fileObjects past index 0.
    if (index > 0) style = { display: 'none' };

    // https://stackoverflow.com/a/1203361/3996097
    const fileType = fileObject.filename
      .split('.')
      .pop()
      .toLowerCase();

    if (fileType === 'jpg') {
      return (
        <SlideshowItemImage
          key={fileObject.filename}
          dir={props.dir}
          style={style}
          fileObject={fileObject}
          index={index}
          props={props.slideshowItems}
          showWeatherOn={props.slidesToShowWeatherOn}
        />
      );
    } // jpg

    if (
      fileType === 'csv' &&
      props.slideshowItems.csv &&
      props.slideshowItems.csv[0]
    ) {
      return (
        <SlideshowItemCSV
          key={fileObject.filename}
          style={style}
          fileObject={fileObject}
          index={index}
          csvData={props.slideshowItems.csv}
          showWeatherOn={props.slidesToShowWeatherOn}
        />
      );
    } // if csv
  }); // props.slideshowItems.files.map // return
}; // const SlideshowItem

export default SlideshowItem;
