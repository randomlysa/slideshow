export const DO_LOGIN = 'DO_LOGIN';
export const DO_LOGOUT = 'DO_LOGOUT';

export function login(token) {
  return {
    type: DO_LOGIN,
    meta: {
      crossTab: true
    },
    payload: token
  };
}

export function logout() {
  return {
    type: DO_LOGOUT,
    meta: {
      crossTab: true
    },
    payload: false
  };
}
