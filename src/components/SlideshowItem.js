import React from 'react';

import { SLIDESHOW_ROOT } from '../api-config';

const SlideshowItem = (props) => {
  return (
    props.slideshowItems.map((item, index) => {
      const itemUrl = `${SLIDESHOW_ROOT}/slideshows/${props.dir}/${item.file}`;
      return (
        <div key={item.file} className="imageHolder">
          <img src={itemUrl} alt="Slideshow Item" />
        </div>
      )
    })
  );
} // const SlideshowItem

export default SlideshowItem;
