# Bootstrap Colorpicker 2.0

[![Build Status](https://travis-ci.org/mjolnic/bootstrap-colorpicker.png)](https://travis-ci.org/mjolnic/bootstrap-colorpicker)

Originally written by [Stefan Petre](http://www.eyecon.ro/)

Read the documentation [here](http://mjolnic.github.io/bootstrap-colorpicker/)

## Contributing

* All the sources are compiled using Grunt, please do not modify dist files directly
* If you modify some source code, please recompile the project dist files
* Check that the index.html demos aren't broken (modify if necessary)
* Test your code at least in Chrome, Firefox and IE >= 10

Thanks =)


## Roadmap

The next major release will be only compatible with Bootstrap 3.x and ECMAScript 5 browsers.
It will integrate new features like palettes (with some useful predefined) and the fantastic
TinyColor plugin that have a powerful color parser and generator. Take a look at the `tinycolor`
branch.

Features:

* [TinyColor](https://github.com/bgrins/TinyColor) integration
* Bootstrap Popover compatibility
* No external background images are required (all UI use gradients for resize support)
* Fully customizable LESS file
* Palettes, with some useful predefined ones (triad', tetrad, monochromatic, analogous, complementary,
  lightness, lighten, darken, brighten, saturate, desaturate, mixed, or your custom colors array)
* More reliable: v2 uses a 100px areas which cause some colors not to be selectable with enough precision, v3 uses 256px (the large version is a 65536 colors matrix, like photoshop) or 128px by default.


Here is a screenschot of the WIP development of Bootrstrap Colorpicker 3 ;)

![captura de pantalla 2014-06-13 a la s 19 41 15](https://cloud.githubusercontent.com/assets/122741/3273246/01ca6326-f322-11e3-8180-bc8596d82256.png)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/mjolnic/bootstrap-colorpicker/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

