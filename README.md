# assertly
Assert class for BDD-style assertions.

Assertly was inspired by [expect.js](https://github.com/Automattic/expect.js) and implements
almost the same interface. Some additional inspiration for assertions came from the
[Chai Assert](http://chaijs.com/api/assert/) and [Chai BDD](http://chaijs.com/api/bdd/)
API's as well.

Assertly was created to address these shortcomings in **expect.js**:

 - [Add-ons](docs/Add-ons.md)
 - [Extensibility](docs/Extensibility.md)
 - [Integration](docs/Integration.md)
 - [Promises](docs/Promises.md)

## Why Not Chai?

Chai pretty much has the above covered, but the somewhat common (and troubling)
practice of using "dangling getters" is something I think should be avoided. While
their use is not essential, it is, as mentioned, common practice. For example:

    expect(x).to.be.null;  // dangling getter

IDE's and linters **rightly** warn that an expression like the above "has no side-effects"
or "does nothing".

# API

The Assertly API is based on BDD-style expectations. For example:

    expect(x).to.be(2);

Where "x" is the "actual" value and 2 is the "expected" value. All things begin with
the call to the `expect` method which returns an `Assert` instance.

This instance has properties (like `to`) that modify the conditions of the expectation
(called "modifiers") and methods (like `be`) that test these conditions (called
"assertions").

## Modifiers

Following are the modifiers provided by Assertly itself.

### not

The `not` modifier simply negates the result of the test. This is somewhat different
then [expect.js](https://github.com/Automattic/expect.js) in some cases, but pure
negation seems much more intuitive.

### only / own

These modifiers apply to `keys` and `property` assertions to restrict what is allowed
to match the criteria. The `only` modifier restricts the assertion such that it will
fail if other keys or properties are present.

The `own` modifier restricts consideration to "own properties" (as in `hasOwnProperty()`).
All inherited properties are ignored when `own` is specified.

### flatly

Used with `equal`

## Assertions

Following are the supported assertions and their aliases ("aka" = "also known as").

 - [`a`](docs/a.md) (aka: "an")
 - [`approx`](docs/approx.md) (aka: "approximately")
 - [`be`](docs/be.md)
 - [`contain`](docs/contain.md)
 - [`empty`](docs/empty.md)
 - [`equal`](docs/equal.md)
 - [`falsy`](docs/falsy.md)
 - [`greaterThan`](docs/greaterThan.md) (aka: "above", "gt")
 - [`greaterThanOrEqual`](docs/greaterThanOrEqual.md) (aka: "atLeast", "ge", "gte")
 - [`in`](docs/in.md)
 - [`key`](docs/key.md) (aka: "keys")
 - [`length`](docs/length.md)
 - [`lessThan`](docs/lessThan.md) (aka: "below", "lt")
 - [`lessThanOrEqual`](docs/lessThanOrEqual.md) (aka: "atMost", "le", "lte")
 - [`match`](docs/match.md)
 - [`nan`](docs/nan.md) (aka: "NaN")
 - [`property`](docs/property.md)
 - [`same`](docs/same.md)
 - [`throw`](docs/throw.md)
 - [`truthy`](docs/truthy.md) (aka: "ok")
 - [`within`](docs/within.md)

## Methods

 - [`get`](docs/get.md)
