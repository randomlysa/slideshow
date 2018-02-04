// https://daveceddia.com/multiple-environments-with-react/
let baseToPHP, baseToSlideshow;
const origin = window.origin;

// localhost:3000 - running webpack dev server
if (origin.includes('localhost:3000')) {
  baseToPHP = "http://localhost/slideshow/public";
  baseToSlideshow = "";
// localhost - running a local build
} else if (origin.includes('localhost')) {
  baseToPHP = "http://localhost/bulletin";
  baseToSlideshow = "/bulletin";
// else - running on some other server {
} else {
  baseToPHP = `${origin}/bulletin`;
  baseToSlideshow = "/bulletin";
}

export const API_ROOT = baseToPHP;
export const SLIDESHOW_ROOT = baseToSlideshow;
