gulp-metalsmith-tasks
=====

[Gulp](http://gulpjs.com/) template files.

What does this particular Gulp setup do?
----------------------------------------

- Watches and compiles Sass and CoffeeScript files
- Minifies CSS and JavaScript files
- Lints CoffeeScript and Sass files
- Tests CSS file using `csscss` and `parker`
- Tests JavaScript file using `jshint`
- Runs Autoprefixer on CSS
- Compiles multiple SVG icons into one SVG file

### Setup

Before installing dependencies, ensure your environment is set up correctly, especially if you plan to use `gulp-imagemin` for image optimization tasks. `gulp-imagemin` may require certain binaries to be compiled from source, which in turn requires additional tools that might not be installed on your system by default.

For macOS users, you can prepare your system by installing these tools using Homebrew:

```bash
brew update
brew install automake autoconf libtool dpkg pkgconfig nasm libpng
rm -rf node_modules
yarn cache clean
yarn install --ignore-engines
```

!currently this is still broken we need to update this for images:compress on windows and mac

Available Tasks
---------------

```
$ gulp
```

> Runs the default `watch` task.

```
$ gulp build
```

> Minifies both the CSS and JavaScript and outputs to the `build/` directory.

```
$ gulp compile:coffee
```

> Compiles CoffeeScript files.

```
$ gulp compile:sass
```

> Compiles Sass files.

```
$ gulp connect
```

> Starts server with LiveReload

```
$ gulp html
```

> Moves `source/index.html` to `build/index.html`

```
$ gulp icons
```

> Compiles multiple SVG icons into one SVG file.

```
$ gulp images
```

> Moves `source/images` to `build/images`

```
$ gulp lint:coffee
```

> Lints CoffeeScript files.

```
$ gulp lint:sass
```

> Lints Sass files.

```
$ gulp minify:css
```

> Minifies CSS file.

```
$ gulp minify:js
```

> Minifies JavaScript file.

```
$ gulp test:css
```

> Runs `csscss` and `parker` on CSS file.

```
$ gulp test:js
```

> Runs `jshint` on JavaScript file.

Setup
-----

```
$ npm install
```

This module need config file, config file Coming Soon!

