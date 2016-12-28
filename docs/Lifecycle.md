# Lifecycle

Each `Assert` instance goes through the following steps of its lifecycle:

 - constructor
 - before
 - begin
 - assertion
 - explain
 - failure
 - report
 - finish

The `constructor` is passed the "actual" value by the `expect` static method. After
the dot-chain is processed and the modifiers are accumulated, eventually an
assertion method is called. When that happens, the rest of the life-cycle is run.

## before

The `before` method is called first when the assertion method is reached. It is given
the "definition" object that defines the assertion. This is stored as `_def` on the
`Assert` instance. This object is the normalized form from the registry object passed
to `register`.

## begin

This method is called passing the array of "expected" arguments (the arguments that
were passed to the assertion method).

To support promises, `begin` checks for a pending assertion and chains its evaluation
to that assertion's completion. If the "actual" value (given to the constructor) or
the "expected" array have promises, `begin` uses `Assert.Promise.all()` to resolve
them and calls `begin` again with the resolved values.

Once resolved, `begin` stores the array it is given as the `expected` property on the
`Assert` instance.

## assertion

This method is called to invoke the actual assertion logic (`this._def.fn()`) and
pass the actual and expected values. If the `not` modifier is present, the result
is negated.

This method will set the `failed` property (possibly to `false`).

This method does nothing if called before the `expected` instance property is set
by `begin`.

## explain

This method is called to generate a string to explain an assertion. It is only
called (by default) when an assertion fails. It is called by `report` before the
instance is passed to the `Assert.report()` static method. See
[Integration](./Integration.md).

In the act of generating the explanation, several other properties are set:

 - `actual` - A string with the printed (`Assert.print`) `value`.
 - `expectation` - A string with the printed (`Assert.print`) `expected`.

These are primarily of interest when writing custom assertions. See
[Extensibility](./Extensibility.md).

## failure

This method is called if the promise chain rejects and the assertion cannot be
evaluated. This sets `failed` to the `Error` object given.

## report

This method is called to report the `Assert` results. Before passing on to the
`Assert.report()` static method (see below), this method ensures that the `failed`
property (if set to `true`) has been converted to a string explaining the failure.

This method does nothing if called before the `failed` instance property is set
by `assertion`.

## finish

This method is called at the end of the life-cycle. It returns an object that
can be used as a conjunction (via `and`) or a promise (via `then`) if the assertion
was asynchronous.
