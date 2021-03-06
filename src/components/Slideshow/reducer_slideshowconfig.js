import {
  GET_CONFIG_FROM_DATABASE_FULFILLED,
  GET_CONFIG_FROM_DATABASE_REJECTED,
  SET_WEATHER_CITY,
  UPDATE_CONFIG,
  DELETE_FILE_FULFILLED,
  UPLOAD_FILE_FULFILLED
} from './actions_slideshowConfig';

export default function(state = {}, action) {
  switch (action.type) {
    case UPDATE_CONFIG:
      const config = action.payload;
      let newSlideOrder = JSON.parse(config.slideOrder);
      return { ...config, slideOrder: newSlideOrder };

    case GET_CONFIG_FROM_DATABASE_REJECTED:
      console.log('GET_CONFIG_FROM_DATABASE_REJECTED');

    case GET_CONFIG_FROM_DATABASE_FULFILLED:
      // If nothing has been configured in the database for this
      // slideshow, action.payload will be undefined.
      if (action.payload === undefined) {
        return {
          timestamp: '',
          name: '',
          slideDuration: '',
          transitionDuration: '',
          slidesToShowWeatherOn: '',
          cityToShowWeatherFor: '',

          slideOrder: {}
        };
      }

      const {
        timestamp,
        name,
        slideDuration,
        transitionDuration,
        slidesToShowWeatherOn,
        cityToShowWeatherFor,

        slideOrder
      } = action.payload;

      // Todo: make a helper to deal with slideOrder.
      if (slideOrder === '') newSlideOrder = '';
      else newSlideOrder = JSON.parse(slideOrder);

      return {
        ...state,
        timestamp,
        name,
        slideDuration,
        transitionDuration,
        slidesToShowWeatherOn,
        cityToShowWeatherFor,

        slideOrder: newSlideOrder
      };
    case SET_WEATHER_CITY:
      return { ...state, cityToShowWeatherFor: action.payload };

    case DELETE_FILE_FULFILLED:
      if (action.result === 'fail') return state;
      const { newConfig } = action;
      newSlideOrder = JSON.parse(newConfig.slideOrder);
      return { ...action.newConfig, slideOrder: newSlideOrder };

    case UPLOAD_FILE_FULFILLED:
      return { ...state, slideOrder: JSON.parse(action.slideOrder) };

    default:
      return state;
  } // switch
} // export default function
