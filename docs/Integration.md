# Integration

A special form of [Extensibility](./Extensibility.md), "integration" is specifically
tacking advantage of the API's to make the `Assert` class fit into other environments,
most likely, a test runner.

Because [Assert](./Assert.md) is an ES6 class, it can be extended cleanly. It can also
be modified. Since testing is a much more controlled environment, it is not nearly as
"hackish" to modify the `Assert` class and **assertly** tries to make this process as
straightforward as possible.

## Static Methods

The static methods of `Assert` can be used to observe or influence all instances
of the `Assert` (or derived) class.

### print

The `print` method converts the object passed to it into a readable string. This
method is used internally to print the actual and expected parameters in the
`explain` method.

### register

This method is called to register modifiers and assertion methods. For more details
see [Extensibility](./Extensibility.md).

### report

This method is called when an assertion is completed. The `Assert` instance is
passed as the sole argument.

You can implement this method in a derived class or hook it to view all assertions
as they are made.

### reportFailure

This method is called by `Assert.report()` for assertions that have failed.

You can implement this method in a derived class or hook it to process failed
assertions.

### wrapAssertion

This method is called to wrap the assertion definition (the sole argument) to
provide the proper [lifecycle](./Lifecycle.md). The returned function is
what is returned by the property getter when the assertion is requested. For
more details on an assertion definition see [Extensibility](./Extensibility.md).
