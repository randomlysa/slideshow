import {
  UPDATE_SLIDESHOW_DURATION,
  UPDATE_TRANSITION_DURATION,

  updateSlideshowDuration,
  updateTransitionDuration,

} from '../../actions/actions_slideshowconfig.js';

test('should update slideshow duration', () => {
  const action = updateSlideshowDuration(8000);
  expect(action).toEqual({
    type: UPDATE_SLIDESHOW_DURATION,
    payload: 8000
  });
});

test('should update transition duration', () => {
  const action = updateTransitionDuration(1500);
  expect(action).toEqual({
    type: UPDATE_TRANSITION_DURATION,
    payload: 1500
  });
});
