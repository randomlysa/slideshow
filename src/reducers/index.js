import { combineReducers } from 'redux';

import SlideshowReducer from './reducer_slideshow';
import SlideshowConfigReducer from './reducer_slideshowconfig';
import AdminReducer from './reducer_admin';

const slideshowApp = combineReducers({
  slideshowItems: SlideshowReducer,
  config: SlideshowConfigReducer,
  admin: AdminReducer
});

export default slideshowApp;
