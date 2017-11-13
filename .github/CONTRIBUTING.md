# Contributing

## Support

The issue tracker is not the place for support requests. If you get stuck with bootstrap-colorpicker, it's very likely
that the fine folks at [StackOverflow](http://stackoverflow.com/) will be able to help you; simply describe the problem
you're having and provide them a link to the repo (so they know what code you're using).


## Issues
For feature requests, suggestions or ideas, add `[SUGGESTION]` before the title of the issue, for anything else follow
the following guidelines.

### Steps to submit an issue
These steps are mandatory. Issues that are not clear or are not clearly reproduceable with a live example will be closed.

- Reproduce your problem in a separated environment, like in JSFiddle,
  [here is a template for it](http://jsfiddle.net/0vopxm13/157/), that you can fork in the same page.
  It already includes the required JS and CSS files.
- Before posting your issue, consider adding this information:
  * Expected behaviour: what should happen?
  * Actual behaviour: what happens instead?
  * Your context: Where it happens? In which browser and version (if applicable)?
  * Plugin version (and/or commit reference).
  * jQuery version you use and list of all other plugins/scripts you are using with this one and may cause some conflict.
  * A link to your JSFiddle (or similar tool) demo where you reproduced the problem (if applicable).

## Pull Requests

Patches and new features are welcome!

- Prerequisites: having `node`, `npm`, `yarn`, `gulp` and `ava` installed in your machine.
- After a fresh clone for your fork, you need to run `yarn install` inside the project's root folder.
- For checking your changes in the browser you can execute `npm start` and navigate to 
  [http://localhost:8080/](http://localhost:8080/)
- Before any commit run always `gulp && npm test` inside the project's root folder, to check that everything still works.
- Do not change the plugin coding style if not necessary.
- The `dist` folder needs to be regenerated using `gulp`.
- Check that the documentation demos aren't broken (modify if necessary).
- Test your code at least in Chrome, Firefox.
- Any new feature should come with updated docs if applicable (a demonstration).
- Push to your fork and submit the pull request.
