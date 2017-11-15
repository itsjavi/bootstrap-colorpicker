# Contributing

All contributions are welcome!

## Support

If you get stuck with this library you can search or ask in the project 
[issues](https://github.com/farbelous/bootstrap-colorpicker/issues) or in
[StackOverflow](http://stackoverflow.com/).

[Describe your problem or questions in detail](./ISSUE_TEMPLATE.md) and follow the steps mentioned in the "Issues"
section of this document.


## Issues

- Search for existing issues before creating a new one, to avoid duplication.
- Give the issue a proper title. Use prefixes like `[feature request]`, `[suggestion]` or `[question]`
  in front of the title when it is not related to a possible bug.
- When the issue is related to a possible bug, please always fill the [suggested template](./ISSUE_TEMPLATE.md) 
  where applicable.
- It is mandatory to provide live examples using [JSFiddle](http://jsfiddle.net/0vopxm13/157/) if applicable,
  that's the quickest and most efficient way for everyone to help you.


## Pull Requests

Pull Requests fixing existing issues are really appreciated, but you can also add a new features.
If your new feature works and receives the approval of the community, it will be merged.

- Your working environment will need `node` (at least v6) with `npm` and `yarn`, `gulp` and `ava`.
- After a fresh clone for your fork, you need to run `yarn install` inside the project's root folder.
- Before committing your changes to Github you have to assure that the tests are green, that the `dist`
  files are regenerated with your `src` changes and that the documentation and examples are still working.
  
  - Regenerate `dist` and the documentation: `npm run build`.
  - Run all tests and the linter: `npm test`.
  - Check the documentation: `npm start` and go to [http://localhost:8080/](http://localhost:8080/).

- Respect the coding style of the project, do not change it if not necessary.
- Test your code changes at least in Chrome and Firefox.
  Preferably it should also be tested in mobile browsers and Edge.
- If possible, cover all your changes with unit tests.
- New features and new options should come with the corresponding documentation and demo.
- When creating a new Pull Request of your branch to the original repository,
  please fill the [suggested template](./PULL_REQUEST_TEMPLATE.md) where applicable.
  
### Documentation updates

To contribute with the documentation, you only need to update the JSDoc comments of the `src/js` code
and the examples in the `src/hbs` folder.

After that and after the documentation changes have been merged into master, the project maintainers
can run `npm run publish-docs` to update the `gh-pages` branch and the documentation website.


### Code of Conduct
Please respect the [Code of Conduct](./.github/CODE_OF_CONDUCT.md).

<hr>

Thanks for reading and following this document.
