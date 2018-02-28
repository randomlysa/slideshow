import React from 'react';
import { SLIDESHOW_ROOT } from '../config/api-config';

const SlideshowItemImage = (props) => {
  const {item, style, dir} = props;
  const filename = item.file;

  const itemUrl = `${SLIDESHOW_ROOT}/slideshows/${dir}/${filename}`;
  return (
    <div key={filename} className="slideshowItem imageHolder" style={style}>
      <img src={itemUrl} alt="Slideshow Item" />
    </div>
  )
}

export default SlideshowItemImage;
