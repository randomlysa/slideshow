import React from 'react';

const SlideshowItem = (props) => {
  return (
    props.slideshowItems.map((item, index) => {
      const itemUrl = `${props.slideshowRoot}/slideshows/${props.dir}/${item.file}`;
      return (
        <div key={item.file} className="imageHolder">
          <img src={itemUrl} alt="Slideshow Item" />
        </div>
      )
    })
  );
} // const SlideshowItem

export default SlideshowItem;
