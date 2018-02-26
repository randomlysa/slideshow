import React from 'react';

const SlideshowItem = (props) => {
  return (
    props.slideshowItems.map((item, index) => {
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
      if (fileType === 'csv') {
        return (
          <div key={item.file} className="csvHolder">
            ...csv data here...
          </div>
        )
      } // csv
    })
  );
} // const SlideshowItem

export default SlideshowItem;
