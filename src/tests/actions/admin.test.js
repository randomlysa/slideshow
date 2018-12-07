import {
  DO_LOGIN,
  DO_LOGOUT,
  login,
  logout
} from '../../actions/actions_admin.js';

// Currently not sure how to implement this.
// test('should log the user in if the password is correct', () => {
//   const action = login();
//   expect(action).toEqual({
//     type: DO_LOGIN,
//     payload: token
//   });
// });

test('should log the user out', () => {
  const action = logout();
  expect(action).toEqual({
    type: DO_LOGOUT,
    meta: {
      crossTab: true
    },
    payload: false
  });
});
