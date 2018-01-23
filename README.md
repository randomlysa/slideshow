# (Another) Slideshow

Why? This slideshow is intended to run as an easy-to-update bulletin board system on a network. Basically, mount the `/slideshows/` folder as a network share, create at least one folder inside `slideshows`, and open `http://ipaddress/basename/nameOfFolderInSlideshows`.

## Getting Started

I run this project on a Turnkey LAMP Stack inside a folder called bulletin (`/var/www/html/bulletin`). In this case, `bulletin` is the basename.

* Open `.htaccess` and make sure the path to `index.html` is correct. `RewriteRule ^ /bulletin/index.html [L]`
* Run `npm run build` and upload the build folder to your server.
* Make a folder called `slideshows`.
* Make at least one folder in the `slideshows` folder (default is `bb1`, but for example, let's use `lunchmenu`)
* Add some jpg files inside `lunchmenu`.
* Open `http://ipaddress/bulletin/lunchmenu`.

You can delete or add files to `lunchmenu` and the slideshow will update somewhat smoothly. (Work in progress)

## Notes

* Easiest to run inside a folder called `bulletin`. Change at your own risk.
* Only works with jpg files.
* Requires php.

