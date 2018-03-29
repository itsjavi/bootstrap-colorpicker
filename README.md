# Bootstrap Colorpicker 3

[Bootstrap Colorpicker](https://github.com/farbelous/bootstrap-colorpicker/) is a simple and customizable colorpicker 
component for jQuery, which is also compatible with Twitter Bootstrap.

[![Build Status](https://api.travis-ci.org/farbelous/bootstrap-colorpicker.svg?branch=master)](https://travis-ci.org/farbelous/bootstrap-colorpicker)


> NOTE that this documentation refers to the latest major version of the project.<br>
> Previous documentation can be found here: [v2.5](https://farbelous.github.io/bootstrap-colorpicker/v2/).

## Install
You can get the latest version in many different ways:

- Downloading [a ZIP file from the releases](https://github.com/farbelous/bootstrap-colorpicker/releases)
- Cloning using Git: `git clone https://github.com/farbelous/bootstrap-colorpicker.git`
- Installing via NPM: `npm install bootstrap-colorpicker`
- Installing via Yarn: `yarn add bootstrap-colorpicker`
- Installing via Composer: `composer require itsjavi/bootstrap-colorpicker`


To start using the component, most of the time you will only need the files under the `dist` folder.
Example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link href="dist/css/bootstrap-colorpicker.css" rel="stylesheet">
</head>
<body>
  <div class="container">
      <input id="mycp" type="text" class="form-control" />
  </div>
  <script src="//code.jquery.com/jquery-3.2.1.js"></script>
  <script src="dist/js/bootstrap-colorpicker.js"></script>
  <script>
    $(function () {
      $('#mycp').colorpicker();
    });
  </script>
</body>
```

## Requirements
Note that this library depends on `jQuery >= 2.1.0`.

The `Twitter Bootstrap` dependency is totally optional, since this library does not depend directly
on it in order to work, except when Bootstrap-related classes like `form-control` and `input-group-addon` are used 
like in the examples. In that case you will need at least the Bootstrap CSS for everything to be displayed correctly.

## Documentation

The documentation of this project is powered by JSDoc and the Minami template together with Handlebars for the
examples.

* [Documentation (latest)](https://farbelous.github.io/bootstrap-colorpicker/)
* [Examples](https://farbelous.github.io/bootstrap-colorpicker/tutorial-Basics.html)
    
Older versions:
* [Documentation (v2.5)](https://farbelous.github.io/bootstrap-colorpicker/v2/)

## Contributing
Please see [CONTRIBUTING](https://github.com/farbelous/bootstrap-colorpicker/blob/master/.github/CONTRIBUTING.md) 
for details.

* [Current Issues](https://github.com/farbelous/bootstrap-colorpicker/issues)
* [Current Pull Requests](https://github.com/farbelous/bootstrap-colorpicker/pulls)
* [Roadmap](https://github.com/farbelous/bootstrap-colorpicker/milestones)

## Credits
Originally written by Stefan Petre.

Continued and maintained by [Javi Aguilar](https://itsjavi.com) and other [project contributors](https://github.com/farbelous/bootstrap-colorpicker/graphs/contributors).

## License
The MIT License (MIT).
Please see [License File](https://github.com/farbelous/bootstrap-colorpicker/blob/master/LICENSE) for more information.
