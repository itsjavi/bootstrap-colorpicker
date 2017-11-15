# Bootstrap Colorpicker 3

[Bootstrap Colorpicker](https://github.com/farbelous/bootstrap-colorpicker/) is a simple and customizable
colorpicker component for Twitter Bootstrap.

[![Build Status](https://api.travis-ci.org/farbelous/bootstrap-colorpicker.svg?branch=master)](https://travis-ci.org/farbelous/bootstrap-colorpicker)

## Install
You can get the code in many different ways, depending on your needs:

- Download the [latest master ZIP file](https://github.com/farbelous/bootstrap-colorpicker/archive/master.zip)
- Clone using Git: `git clone https://github.com/farbelous/bootstrap-colorpicker.git`
- Install using NPM: `npm install bootstrap-colorpicker`
- Install using Yarn: `yarn add bootstrap-colorpicker`
- Install using Composer: `composer require itsjavi/bootstrap-colorpicker`


To start using the component, most of the time you will only need the files under the `dist` folder.
Example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
  <link href="dist/css/bootstrap-colorpicker.css" rel="stylesheet">
</head>
<body>
  <div class="container">
      <input id="mycp" type="text" class="form-control" />
  </div>
  <script src="//code.jquery.com/jquery-3.2.1.js"></script>
  <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.js"></script>
  <script src="dist/js/bootstrap-colorpicker.js"></script>
  <script>
    $(function () {
      $('#mycp').colorpicker();
    });
  </script>
</body>
```

## Requirements
Note that this library depends on:

* jQuery >= 2.1.0
* Twitter Bootstrap >= 3.0.0

## Documentation

The documentation of this project is powered by JSDoc and the Minami template together with Handlebars for the
examples.

* [Documentation](https://farbelous.github.io/bootstrap-colorpicker/)
* [Examples](https://farbelous.github.io/bootstrap-colorpicker/tutorial-01_Basics.html)

## Contributing
Please see [CONTRIBUTING](https://github.com/farbelous/bootstrap-colorpicker/blob/master/.github/CONTRIBUTING.md) 
for details.

* [Current Issues](https://github.com/farbelous/bootstrap-colorpicker/issues)
* [Current Pull Requests](https://github.com/farbelous/bootstrap-colorpicker/pulls)
* [Roadmap](https://github.com/farbelous/bootstrap-colorpicker/milestones)

## Credits
Originally written by Stefan Petre.

## License
The MIT License (MIT).
Please see [License File](https://github.com/farbelous/bootstrap-colorpicker/blob/master/LICENSE) for more information.
