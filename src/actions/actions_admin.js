export const DO_LOGIN = 'DO_LOGIN';
export const DO_LOGOUT = 'DO_LOGOUT';

export function login (token) {
    return {
        type: DO_LOGIN,
        payload: token
    };
}

export function logout() {
    return {
        type: DO_LOGOUT,
        payload: false
    };
}
