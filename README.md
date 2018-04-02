# Bootstrap Colorpicker 3

[Bootstrap Colorpicker](https://github.com/farbelous/bootstrap-colorpicker/) is a simple and customizable colorpicker 
component for jQuery, which is also compatible with Twitter Bootstrap.

 [![Build Status](https://img.shields.io/travis/farbelous/bootstrap-colorpicker/master.svg?style=flat-square)](https://travis-ci.org/farbelous/bootstrap-colorpicker)
[![npm](https://img.shields.io/npm/v/bootstrap-colorpicker.svg?style=flat-square)](https://www.npmjs.com/package/bootstrap-colorpicker)
[![npm@next](https://img.shields.io/npm/v/bootstrap-colorpicker/next.svg?style=flat-square)](https://www.npmjs.com/package/bootstrap-colorpicker?activeTab=versions)
[![Donate](https://img.shields.io/badge/%E2%9D%A4-Donate%20to%20this%20project-e0a61d.svg?longCache=true&style=flat-square)](https://github.com/farbelous/farbelous.github.io/blob/master/README.md#donate)
[![Supporters](https://img.shields.io/badge/%F0%9F%92%AA-Supporters-333333.svg?longCache=true&style=flat-square)](https://github.com/farbelous/farbelous.github.io/blob/master/BACKERS.md#backers)
[![Backers on Open Collective](https://opencollective.com/bootstrap-colorpicker/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/bootstrap-colorpicker/sponsors/badge.svg)](#sponsors)

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

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="graphs/contributors"><img src="https://opencollective.com/bootstrap-colorpicker/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/bootstrap-colorpicker#backer)]

<a href="https://opencollective.com/bootstrap-colorpicker#backers" target="_blank"><img src="https://opencollective.com/bootstrap-colorpicker/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/bootstrap-colorpicker#sponsor)]

<a href="https://opencollective.com/bootstrap-colorpicker/sponsor/0/website" target="_blank"><img src="https://opencollective.com/bootstrap-colorpicker/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/bootstrap-colorpicker/sponsor/1/website" target="_blank"><img src="https://opencollective.com/bootstrap-colorpicker/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/bootstrap-colorpicker/sponsor/2/website" target="_blank"><img src="https://opencollective.com/bootstrap-colorpicker/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/bootstrap-colorpicker/sponsor/3/website" target="_blank"><img src="https://opencollective.com/bootstrap-colorpicker/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/bootstrap-colorpicker/sponsor/4/website" target="_blank"><img src="https://opencollective.com/bootstrap-colorpicker/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/bootstrap-colorpicker/sponsor/5/website" target="_blank"><img src="https://opencollective.com/bootstrap-colorpicker/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/bootstrap-colorpicker/sponsor/6/website" target="_blank"><img src="https://opencollective.com/bootstrap-colorpicker/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/bootstrap-colorpicker/sponsor/7/website" target="_blank"><img src="https://opencollective.com/bootstrap-colorpicker/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/bootstrap-colorpicker/sponsor/8/website" target="_blank"><img src="https://opencollective.com/bootstrap-colorpicker/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/bootstrap-colorpicker/sponsor/9/website" target="_blank"><img src="https://opencollective.com/bootstrap-colorpicker/sponsor/9/avatar.svg"></a>



## License
The MIT License (MIT).
Please see [License File](https://github.com/farbelous/bootstrap-colorpicker/blob/master/LICENSE) for more information.