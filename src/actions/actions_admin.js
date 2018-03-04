export const DO_LOGIN = 'DO_LOGIN';
export const DO_LOGOUT = 'DO_LOGOUT';

export function login () {
    return {
        type: DO_LOGIN,
        payload: true
    };
}

export function logout() {
    return {
        type: DO_LOGOUT,
        payload: false
    };
}
