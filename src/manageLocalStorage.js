// https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('slideshow');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState)
    } catch (err) {
        return undefined;
    }
}

export const saveState = (slideshow) => {
    try {
        const serializedState = JSON.stringify(slideshow);
        localStorage.setItem('slideshow', serializedState);
    } catch (err) {
        // Ignore write errors.
    }
}

export const clearStorage = () => {
    try {
        localStorage.setItem('slideshow', '');
        window.location.reload(true);
    } catch (err) {
        console.log(err);
    }
}
