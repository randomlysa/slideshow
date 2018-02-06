// https://daveceddia.com/multiple-environments-with-react/

// set basename here, it will be overridden if needed
// (example: for local webpack server)

// NO SLASHES!
let baseToSlideshow = 'bulletin';

let baseToPHP;
const origin = window.origin;

// localhost:3000 - running webpack dev server
if (origin.includes('localhost:3000')) {
  baseToPHP = 'http://localhost/slideshow/public';
  baseToSlideshow = '';
// localhost - running a local build
} else if (origin.includes('localhost')) {
  baseToPHP = `http://localhost/${baseToSlideshow}`;

// else - running on some other server {
} else {
  baseToPHP = `${origin}/${baseToSlideshow}`;
}

export const API_ROOT = baseToPHP;
export const SLIDESHOW_ROOT = baseToSlideshow;
