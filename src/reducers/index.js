import { combineReducers } from 'redux';

import SlideshowReducer from './reducer_slideshow';
import SlideshowConfigReducer from './reducer_slideshowconfig';

const slideshowApp = combineReducers({
  slideshowItems: SlideshowReducer,
  config: SlideshowConfigReducer
});

export default slideshowApp;
