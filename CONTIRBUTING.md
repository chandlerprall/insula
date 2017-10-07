# Issues

Use (GitHub issues)[https://github.com/chandlerprall/insula/issues] to file and track bugs. Please ensure your bug description is clear and has sufficient instructions to be able to reproduce the issue.

The absolute best way to report a bug is to submit a pull request including a new failing test which describes the bug. When the bug is fixed, your pull request can then be merged!

The next best way to report a bug is to provide a reduced test case on jsFiddle or jsBin or produce exact code inline in the issue which will reproduce the bug.

# Pull Requests

All active development of Insula happens on GitHub. We actively welcome your [pull requests](https://help.github.com/articles/creating-a-pull-request).

 1. Fork the repo and create your branch from `master`.
 2. Install all dependencies. (`npm install`)
 3. If you've added code, add tests.
 5. Run tests and ensure your code passes lint. (`npm run test`)

## Coding Style

* 4 spaces for indentation (no tabs)
* Prefer `'` over `"`
* Use ES4 syntax except for `import`/`export` - there is no transpilation process other than Rollup to resolve imports
* Use semicolons;
* Avd abbr wrds.

## License

By contributing to Insula you agree that your contributions will be licensed under its MIT license.