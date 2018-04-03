<a href="https://farbelous.io/bootstrap-colorpicker">
    <img alt="Logo by @reallinfo" src="logo.png" width="190px" />
</a>

# Bootstrap Colorpicker

[Bootstrap Colorpicker](https://github.com/farbelous/bootstrap-colorpicker/) is a simple and customizable colorpicker 
component for jQuery, which is also compatible with Twitter Bootstrap.

[![Build Status](https://img.shields.io/travis/farbelous/bootstrap-colorpicker/master.svg?style=flat-square)](https://travis-ci.org/farbelous/bootstrap-colorpicker)
[![npm](https://img.shields.io/npm/v/bootstrap-colorpicker.svg?style=flat-square)](https://www.npmjs.com/package/bootstrap-colorpicker)
[![npm@next](https://img.shields.io/npm/v/bootstrap-colorpicker/next.svg?style=flat-square)](https://www.npmjs.com/package/bootstrap-colorpicker?activeTab=versions)
[![Slack](https://img.shields.io/badge/chat-on%20slack-509689.svg?longCache=true&style=flat-square)](https://farbelous.slack.com)
[![Backers](https://img.shields.io/badge/[-Backers%20]-555555.svg?longCache=true&style=flat-square)](https://github.com/farbelous/bootstrap-colorpicker/blob/master/BACKERS.md#backers)
[![Sponsors](https://img.shields.io/badge/[-Sponsors%20]-555555.svg?longCache=true&style=flat-square)](https://github.com/farbelous/bootstrap-colorpicker/blob/master/BACKERS.md#sponsors)
[![Donate](https://img.shields.io/badge/%E2%9D%A4-Donate%20to%20this%20project-e0a61d.svg?longCache=true&style=flat-square)](https://github.com/farbelous/bootstrap-colorpicker/blob/master/BACKERS.md#sponsors--backers)

> NOTE that this documentation refers to the next major version of the project, living in the master branch.<br>
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

The documentation of this project has been created with by Handlebars, JSDoc and the Minami template.

* [Documentation (@next)](https://farbelous.github.io/bootstrap-colorpicker/)
* [Examples](https://farbelous.github.io/bootstrap-colorpicker/tutorial-Basics.html)
    
Older versions:
* [Documentation (v2.5.2)](https://farbelous.github.io/bootstrap-colorpicker/v2/)

## Contributions
* [Issues](https://github.com/farbelous/bootstrap-colorpicker/issues)
* [Pull Requests](https://github.com/farbelous/bootstrap-colorpicker/pulls)
* [Milestones](https://github.com/farbelous/bootstrap-colorpicker/milestones)
* [Planned Features](https://github.com/farbelous/bootstrap-colorpicker/projects)

This project exists thanks to all the [people who contribute](https://github.com/farbelous/bootstrap-colorpicker/graphs/contributors).

<a href="https://github.com/farbelous/bootstrap-colorpicker/graphs/contributors"><img src="https://opencollective.com/bootstrap-colorpicker/contributors.svg?width=890&button=false" /></a>

Please read [CONTRIBUTING](https://github.com/farbelous/bootstrap-colorpicker/blob/master/.github/CONTRIBUTING.md) 
before sending a pull request or issue.

You can also contribute in form of [**donations**](https://github.com/farbelous/bootstrap-colorpicker/blob/master/BACKERS.md#sponsors--backers) like all the awesome
[Backers and Sponsors](https://github.com/farbelous/bootstrap-colorpicker/blob/master/BACKERS.md#sponsors--backers) that are already doing that.


## Sponsors

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
Please see the [License File](https://github.com/farbelous/bootstrap-colorpicker/blob/master/LICENSE) for more information.

## Credits
Originally written by Stefan Petre in 2013.

Rewritten and maintained by [Javi Aguilar](https://itsjavi.com) and the contributors.