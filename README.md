<a href="https://farbelous.io/bootstrap-colorpicker">
    <img alt="Logo by @reallinfo" src="logo.png" width="190px" />
</a>

# Bootstrap Colorpicker

[Bootstrap Colorpicker](https://github.com/farbelous/bootstrap-colorpicker/) is a simple and customizable colorpicker 
component for jQuery, which is also compatible with Twitter Bootstrap.

[![Build Status](https://img.shields.io/travis/farbelous/bootstrap-colorpicker/master.svg?style=flat-square)](https://travis-ci.org/farbelous/bootstrap-colorpicker)
[![npm](https://img.shields.io/npm/v/bootstrap-colorpicker.svg?style=flat-square)](https://www.npmjs.com/package/bootstrap-colorpicker)
[![npm@next](https://img.shields.io/npm/v/bootstrap-colorpicker/next.svg?style=flat-square)](https://www.npmjs.com/package/bootstrap-colorpicker?activeTab=versions)
[![Donate](https://img.shields.io/badge/%E2%9D%A4-Donate%20to%20this%20project-e0a61d.svg?longCache=true&style=flat-square)](https://github.com/itsjavi/itsjavi.github.io/blob/master/BACKERS.md#sponsors--backers)
[![Supporters](https://img.shields.io/badge/%F0%9F%92%AA-Supporters-333333.svg?longCache=true&style=flat-square)](https://github.com/itsjavi/itsjavi.github.io/blob/master/BACKERS.md#sponsors)

> NOTE that this documentation refers to the **latest stable version** of the project.<br>
> Previous documentation can be found here: [v2.x](https://farbelous.github.io/bootstrap-colorpicker/v2/).

## Install
You can get the latest version in many different ways:

- Downloading [a ZIP file from the releases](https://github.com/farbelous/bootstrap-colorpicker/releases)
- Cloning using Git: `git clone https://github.com/farbelous/bootstrap-colorpicker.git`
- Installing via NPM: `npm install bootstrap-colorpicker`
- Installing via Yarn: `yarn add bootstrap-colorpicker`
- Installing via Composer: `composer require itsjavi/bootstrap-colorpicker`


To start using the component, most of the time you will only need the files under the `dist` folder.
The `dist` folder will be available if you installed this package via npm or yarn. In any other cases
you will need to run `yarn install && npm run build` in order to generate it.


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
      $('#mycp').colorpicker({popover:false});
    });
  </script>
</body>
```

## Requirements
Note that this library depends on `jQuery >= 2.1.0`.

The `Twitter Bootstrap` dependency is recommended but optional, since this library does not depend directly
on it in order to work, except when Bootstrap-related classes like `form-control` and `input-group-append` are used 
like in the examples. In that case you will need at least the Bootstrap CSS for everything to be displayed correctly.

The Bootstrap JS bundle is required in case you want to use the Bootstrap Popover instead of the built-in one.
By default all instances are created using the Bootstrap Popover. In order to make the plugin work without Bootstrap,
you need to set the `popover` option to `false`.

## Documentation

The documentation of this project has been created with by Handlebars, JSDoc and the Minami template.

* [Documentation (@next)](https://farbelous.github.io/bootstrap-colorpicker/)
* [Examples](https://farbelous.github.io/bootstrap-colorpicker/tutorial-Basics.html)
    
Older versions:
* [Documentation (v2.x)](https://farbelous.github.io/bootstrap-colorpicker/v2/)

## Contributions
* [Issues](https://github.com/farbelous/bootstrap-colorpicker/issues)
* [Pull Requests](https://github.com/farbelous/bootstrap-colorpicker/pulls)
* [Milestones](https://github.com/farbelous/bootstrap-colorpicker/milestones)
* [Planned Features](https://github.com/farbelous/bootstrap-colorpicker/projects)

This project exists thanks to all the [people who contribute](https://github.com/farbelous/bootstrap-colorpicker/graphs/contributors).

Please read [CONTRIBUTING](https://github.com/farbelous/bootstrap-colorpicker/blob/master/.github/CONTRIBUTING.md) 
before sending a pull request or issue.

## License
The MIT License (MIT).
Please see the [License File](https://github.com/farbelous/bootstrap-colorpicker/blob/master/LICENSE) for more information.

## Credits
Originally written by Stefan Petre in 2013.

Rewritten and maintained by [Javi Aguilar](https://itsjavi.com) and all other contributors.

*With the support of JetBrains.*