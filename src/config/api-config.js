// https://daveceddia.com/multiple-environments-with-react/

// set basename here, it will be overridden if needed
// (example: for local webpack server)

// NO SLASHES!
let basename = 'bulletin';

let PHPRoot, slideshowRoot;
const origin = window.origin;

// localhost:3000 - running webpack dev server
if (origin && origin.includes('localhost:3000')) {
  PHPRoot = 'http://localhost/slideshow/public';
  basename = '';
  slideshowRoot = 'http://localhost:3000/';

  // localhost - running a local build
} else if (origin && origin.includes('localhost')) {
  PHPRoot = `http://localhost/${basename}`;
  slideshowRoot = `/${basename}`;

  // else - running on some other server {
} else {
  PHPRoot = `${origin}/${basename}`;
  slideshowRoot = `/${basename}`;
}

export const API_ROOT = PHPRoot;
export const BASENAME = basename;
export const SLIDESHOW_ROOT = slideshowRoot;
export const JWT_SECRET = '4lkdfjlkvcv55dfvgnmjuyyu6yraeqaerg4';
