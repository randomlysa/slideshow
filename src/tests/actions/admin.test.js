import {
  UPDATE_SLIDESHOW_DURATION,
  UPDATE_TRANSITION_DURATION,
  VERIFY_PASSWORD,

  updateSlideshowDuration,
  updateTransitionDuration,
  checkPassword,
  logout
} from '../../actions/actions_admin.js';

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

test('should log the user in if the password is correct', () => {
  const action = checkPassword('14400');
  expect(action).toEqual({
    type: VERIFY_PASSWORD,
    payload: true
  });
});

test('should return an error if the password is incorrect', () => {
  const action = checkPassword('1400');
  expect(action).toEqual({
    type: VERIFY_PASSWORD,
    payload: false,
    passwordEntered: true
  });
});

test('should log the user out', () => {
  const action = logout();
  expect(action).toEqual({
    type: VERIFY_PASSWORD,
    payload: false
  });
});
