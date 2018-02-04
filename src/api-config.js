// https://daveceddia.com/multiple-environments-with-react/
let baseToPHP;
const origin = window.origin;

// localhost:3000 - running webpack dev server
if (origin.includes('localhost:3000')) {
  baseToPHP = "http://localhost/slideshow/public";
// localhost - running a local build
} else if (origin.includes('localhost')) {
  baseToPHP = "http://localhost/bulletin";
// else - running on some other server {
} else {
  baseToPHP = `${origin}/bulletin`;
}

export const API_ROOT = baseToPHP;
