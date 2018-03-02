import React from 'react';
import { SLIDESHOW_ROOT } from '../config/api-config';

const SlideshowItemImage = (props) => {
  const {fileObject, style, dir} = props;
  const filename = fileObject.filename;

  const imgUrl = `${SLIDESHOW_ROOT}/slideshows/${dir}/${filename}`;
  return (
    <div key={filename} className="slideshowItem imageHolder" style={style}>
      <img src={imgUrl} alt="Slideshow Item" />
    </div>
  )
}

export default SlideshowItemImage;
