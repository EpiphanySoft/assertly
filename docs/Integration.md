# Integration

A special form of [Extensibility](./Extensibility.md), "integration" is specifically
tacking advantage of the API's to make the `Assert` class fit into other environments,
most likely, a test runner.

Because [Assert](./Assert.md) is an ES6 class, it can be extended or even modified as
necessary. Since testing is a much more controlled environment, it is not nearly as
"hackish" to modify the `Assert` class and **assertly** tries to make this process as
straightforward as possible.

## Instance Methods

Each `Assert` instance goes through a simple life-cycle:

 - constructor
 - before
 - begin
 - assertion
 - failure
 - report
 - finish

The `constructor` is passed the "actual" value by the `expect` static method. After
the dot-chain is processed and the `modifiers` are accumulated, eventually an
assertion method is called. When that happens, the rest of the life-cycle is run.

### before

The `before` method is called when the assertion method is called. It is passed
the "definition" object that defines the assertion. This is stored as `def` on the
`Assert` instance.

### begin

This method is called passing the array of "expected" arguments (the arguments that
were passed to the assertion method).

To support promises, `begin` checks for a pending assertion and chains its evaluation
to that assertion's completion. If the "actual" value (given to the constructor) or
the "expected" array have promises, `begin` uses `Assert.Promise.all()` to resolve
them and calls `begin` again with the resolved values.

In the end, `begin` stores the array it is given as the `expected` property on the
`Assert` instance.

### assertion

This method is called to invoke the actual assertion logic (`this.def.fn()`) and
pass the actual and expected values. If the `not` modifier is present, the result
is inverted.

This method will set the `failed` property (possibly to `false`).

This method does nothing if called before `this.expected` is set.

### failure

This method is called if the promise chain rejects and the assertion cannot be
evaluated. This sets `failed` to the `Error` object given.

### report

This method does nothing if called before `this.failed` is set.

### finish

## Static Methods

The static methods of `Assert` can be used to observe or influence all instances
of the `Assert` (or derived) class.

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

This method is called to
