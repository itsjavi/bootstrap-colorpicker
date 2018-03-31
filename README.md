# Bootstrap Colorpicker 3

[Bootstrap Colorpicker](https://github.com/farbelous/bootstrap-colorpicker/) is a simple and customizable colorpicker 
component for jQuery, which is also compatible with Twitter Bootstrap.

[![Build Status](https://img.shields.io/travis/farbelous/bootstrap-colorpicker/master.svg?style=flat-square)](https://travis-ci.org/farbelous/bootstrap-colorpicker)
[![npm](https://img.shields.io/npm/v/bootstrap-colorpicker.svg?style=flat-square)](https://www.npmjs.com/package/bootstrap-colorpicker)
[![npm@next](https://img.shields.io/npm/v/bootstrap-colorpicker/next.svg?style=flat-square)](https://www.npmjs.com/package/bootstrap-colorpicker?activeTab=versions)
[![Donate](https://img.shields.io/badge/%E2%9D%A4-Donate%20to%20this%20project-e0a61d.svg?longCache=true&style=flat-square)](https://github.com/farbelous/farbelous.github.io/blob/master/README.md#donate)
[![Supporters](https://img.shields.io/badge/%F0%9F%92%AA-Supporters-333333.svg?longCache=true&style=flat-square)](https://github.com/farbelous/farbelous.github.io/blob/master/BACKERS.md#backers)

> NOTE that this documentation refers to the next major version of the project.<br>
> Previous documentation can be found here: [v2.5.2](https://farbelous.github.io/bootstrap-colorpicker/v2/).

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

* [Documentation (@next)](https://farbelous.github.io/bootstrap-colorpicker/)
* [Examples](https://farbelous.github.io/bootstrap-colorpicker/tutorial-Basics.html)
    
Older versions:
* [Documentation (v2.5.2)](https://farbelous.github.io/bootstrap-colorpicker/v2/)

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