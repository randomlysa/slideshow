export const VERIFY_PASSWORD = 'VERIFY_PASSWORD';

export function checkPassword(password) {
    if (password === "14400") {
        return {
            type: VERIFY_PASSWORD,
            payload: true
        };
    } else {
        return {
            type: VERIFY_PASSWORD,
            payload: false,
            passwordEntered: Boolean((password))
        };
    }
}

export function logout() {
    return {
        type: VERIFY_PASSWORD,
        payload: false
    };
}
