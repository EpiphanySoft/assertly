# Integration

A special form of [Extensibility](./Extensibility.md), "integration" is specifically
tacking advantage of the API's to make the `Assert` class fit into other environments,
most likely, a test runner.

Because [Assert](./Assert.md) is an ES6 class, it can be extended or even modified as
necessary. Since testing is a much more controlled environment, it is not nearly as
"hackish" to modify the `Assert` class and **assertly** tries to make this process as
straightforward as possible.

The first two methods of interest are `report` and `reportFailure` and a `static` methods
of `Assert`.
