# (Another) Slideshow

Why? This slideshow is intended to run as an easy-to-update bulletin board system on a network. Basically, mount the `/slideshows/` folder as a network share, create at least one folder inside `slideshows`, and open `http://ipaddress/basename/nameOfFolderInSlideshows`.

## Getting Started

I run this project on a Turnkey LAMP Stack inside a folder called bulletin (`/var/www/html/bulletin`). In this case, `bulletin` is the basename. If running the project from `/var/www/html`, the basename would be `/`.

In `index.js`, set `const customBasename = true;` if using a `/basename/` or `false` if using `/`.

Open `.htaccess` and make sure the path to `index.html` is correct. Examples:
* `RewriteRule ^ /bulletin/index.html [L]` or
* `RewriteRule ^ /index.html [L]`

Run `npm run build` and upload the build folder to your server.

Make at least one folder in the `slideshows` folder (default is `bb1`, but for example, let's use `lunchmenu`), and open `http://ipaddress/basename/lunchmenu`.

You can delete or add files to `lunchmenu` and the slideshow will update somewhat smoothly. (Work in progress)

## Notes

* Only works with jpg files.
* Requires php.

