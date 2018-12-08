import React from 'react';
import { SLIDESHOW_ROOT } from '../../config/api-config';

const SlideshowItemImage = props => {
  const { fileObject, style, dir } = props;
  const filename = fileObject.filename;
  // Set a default classname.
  let className = 'slideshowItem imageHolder';
  if (props.showWeatherOn.includes(filename)) {
    // props.showWeather contains any filesname(s) that were selected to show
    // weather on. If this filename is in that list, add the class 'showWeather'
    className = 'slideshowItem imageHolder showWeather';
  }

  const imgUrl = `${SLIDESHOW_ROOT}/slideshows/${dir}/${filename}`;
  return (
    <div key={filename} className={className} style={style}>
      <img src={imgUrl} alt="Slideshow Item" />
    </div>
  );
};

export default SlideshowItemImage;
