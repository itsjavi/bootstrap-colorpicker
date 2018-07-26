<a class="readme-logo" href="https://farbelous.io/bootstrap-colorpicker">
    <img alt="Logo by @reallinfo" src="logo.png" width="128px" />
</a>

# Bootstrap Colorpicker

<!--version-->

[Bootstrap Colorpicker](https://github.com/farbelous/bootstrap-colorpicker/) is a modular color picker plugin for Bootstrap 4.

[![Build Status](https://img.shields.io/travis/farbelous/bootstrap-colorpicker/master.svg?style=flat-square)](https://travis-ci.org/farbelous/bootstrap-colorpicker)
[![npm](https://img.shields.io/npm/v/bootstrap-colorpicker.svg?style=flat-square)](https://www.npmjs.com/package/bootstrap-colorpicker)
[![Donate](https://img.shields.io/badge/%E2%9D%A4-Donate%20to%20this%20project-e0a61d.svg?longCache=true&style=flat-square)](https://github.com/itsjavi/itsjavi.github.io/blob/master/BACKERS.md#sponsors--backers)
[![Supporters](https://img.shields.io/badge/%F0%9F%92%AA-Supporters-333333.svg?longCache=true&style=flat-square)](https://github.com/itsjavi/itsjavi.github.io/blob/master/BACKERS.md#sponsors)

## Install
You can get the latest version in many different ways:

- Downloading [a ZIP file from the releases](https://github.com/farbelous/bootstrap-colorpicker/releases)
- Cloning using Git: `git clone https://github.com/farbelous/bootstrap-colorpicker.git`
- Installing via NPM: `npm install bootstrap-colorpicker`
- Installing via Yarn: `yarn add bootstrap-colorpicker`
- Installing via Composer: `composer require itsjavi/bootstrap-colorpicker`

Note that the `dist` files are only distributed via the NPM and Yarn installations.

For the rest methods, you will need to generate the files initializing the project with `yarn install`
and then building the code using `npm run build`.

## Versions

<table class="table table-bordered table-striped">
  <thead>
    <tr>
        <th>Colorpicker version</th>
        <th>Compatible Bootstrap version</th>
        <th>Dependencies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>
          <a href="https://github.com/farbelous/bootstrap-colorpicker/tree/v2.x">v2.x</a> <br>
          <a href="https://farbelous.github.io/bootstrap-colorpicker/v2">Documentation</a>
        </td>
        <td>(any)</td>
        <td>
          <ul>
            <li>jQuery >= 1.10</li>
            <li>Bootstrap CSS (input addon)</li>
          </ul>
        </td>
    </tr>
    <tr>
        <td>
          <a href="https://github.com/farbelous/bootstrap-colorpicker">v3.x</a> <br>
          <a href="https://farbelous.github.io/bootstrap-colorpicker">Documentation</a>
        </td>
        <td>Bootstrap 4</td>
        <td>
          <ul>
            <li>jQuery >= 2.1.0</li>
            <li>Bootstrap CSS (input addon, popover)</li>
            <li>Bootstrap JS Bundle (popover)</li>
          </ul>
        </td>
    </tr>
  </thead>
</table>


Note that the plugin may work without Bootstrap if your code is not using any of the mentioned Bootstrap
dependencies.


## Basic example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link href="//cdn.rawgit.com/twbs/bootstrap/v4.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="dist/css/bootstrap-colorpicker.css" rel="stylesheet">
</head>
<body>
  <div class="jumbotron">
      <h1>Bootstrap Colorpicker Demo</h1>
      <input id="demo" type="text" class="form-control" value="rgb(255, 128, 0)" />
  </div>
  <script src="//code.jquery.com/jquery-3.3.1.js"></script>
  <script src="//cdn.rawgit.com/twbs/bootstrap/v4.1.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="dist/js/bootstrap-colorpicker.js"></script>
  <script>
    $(function () {
      // Basic instantiation:
      $('#demo').colorpicker();
      
      // Example using an event, to change the color of the .jumbotron background:
      $('#demo').on('colorpickerChange', function(event) {
        $('.jumbotron').css('background-color', event.color.toString());
      });
    });
  </script>
</body>
```

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

Written and maintained by [Javi Aguilar](https://itsjavi.com) and all other contributors.

*Based on Stefan Petre's color picker (2013).*

*Thanks to JetBrains for supporting this project.*