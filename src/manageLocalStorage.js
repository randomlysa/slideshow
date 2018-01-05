// https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('slideShow');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState)
    } catch (err) {
        return undefined;
    }
}

export const saveState = (slideShow) => {
    try {
        const serializedState = JSON.stringify(slideShow);
        localStorage.setItem('slideShow', serializedState);
    } catch (err) {
        // Ignore write errors.
    }
}

export const clearStorage = () => {
    try {
        localStorage.setItem('slideShow', '');
        window.location.reload(true);
    } catch (err) {
        console.log(err);
    }
}
