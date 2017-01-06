# assertly
Assert class for BDD-style assertions.

[![Build Status](https://travis-ci.org/dongryphon/assertly.svg?branch=master)](https://travis-ci.org/dongryphon/assertly)
[![Dependencies Status](https://david-dm.org/dongryphon/assertly/status.svg)](https://david-dm.org/dongryphon/assertly)
[![npm version](https://badge.fury.io/js/assertly.svg)](https://badge.fury.io/js/assertly)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

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

# Installation

To install using `npm`:

    $ npm install assertly --save-dev

To install using `yarn`:

    $ yarn add assertly --dev

# API

The Assertly API is based on BDD-style expectations. For example:

    expect(x).to.be(2);

Where "x" is the "actual" value and 2 is the "expected" value. All things begin with
the call to the `expect` method which returns an `Assert` instance.

This instance has properties (like `to`) that modify the conditions of the expectation
(called "modifiers") and methods (like `be`) that test these conditions (called
"assertions").

## Assertions

An assertion is a method that is called to perform a test for truth. The most common
assertion is `be`:

    expect(x).to.be(y);  // compares x === y

Assertions can also be used as modifiers. Such usage, however, does not evaluate
them for truthfulness. For example:

    expect(x).to.be.above(2);

In this case, `above` is the assertion and `be` simply acts as a modifier.

Following are the supported assertions and their aliases ("aka" = "also known as").

 - [`a`](docs/words/a.md) (aka: "an")
 - [`approx`](docs/words/approx.md) (aka: "approximately")
 - [`be`](docs/words/be.md)
 - [`contain`](docs/words/contain.md)
 - [`empty`](docs/words/empty.md)
 - [`equal`](docs/words/equal.md)
 - [`falsy`](docs/words/falsy.md)
 - [`greaterThan`](docs/words/greaterThan.md) (aka: "above", "gt")
 - [`greaterThanOrEqual`](docs/words/greaterThanOrEqual.md) (aka: "atLeast", "ge", "gte")
 - [`in`](docs/words/in.md)
 - [`key`](docs/words/key.md) (aka: "keys")
 - [`length`](docs/words/length.md)
 - [`lessThan`](docs/words/lessThan.md) (aka: "below", "lt")
 - [`lessThanOrEqual`](docs/words/lessThanOrEqual.md) (aka: "atMost", "le", "lte")
 - [`match`](docs/words/match.md)
 - [`nan`](docs/words/nan.md) (aka: "NaN")
 - [`property`](docs/words/property.md)
 - [`same`](docs/words/same.md)
 - [`throw`](docs/words/throw.md)
 - [`truthy`](docs/words/truthy.md) (aka: "ok")
 - [`within`](docs/words/within.md)

## Modifiers

Modifiers are simply words that decorate assertions. Their presence typically alters
the evaluation of assertions but they can sometimes just serve as grammatical aids to
make the code readable.

There is no required order to modifiers. The following are equivalent:

    expect(x).to.not.be(2);
    expect(x).not.to.be(2);

Below are the modifiers provided by Assertly itself.

### not

The `not` modifier simply negates the result of the test. This is somewhat different
then [expect.js](https://github.com/Automattic/expect.js) in some cases, but pure
negation seems much more intuitive.

### only

This modifier applies to `keys` and `property` assertions to restrict what is allowed
to match the criteria. The `only` modifier restricts the assertion such that it will
fail if other keys or properties are present.

### own

The `own` modifier also applies to `keys` and `property` and restricts consideration
to "own properties" (as in `hasOwnProperty()`).

All inherited properties are ignored when `own` is specified.

### exactly

Used with `throw` to change the string matching behavior from sub-string match to
full string match.

### flatly

Used with `equal` and `same` to flatten the prototype chains of objects and compare
all of the enumerable properties.

### to

Serves only to aid readability.

## Methods

Asserts can also provide methods. These methods look syntactically like assertions
but do not evaluate truth claims. Instead they perform some more general operation.

Assertly provides these methods:

 - [`get`](docs/words/get.md)

## Conjunctions

A conjunction is a word that can be used to create a new `Assert` instance based on
a previous instance.

For example:

    expect(x).to.be.above(2).and.below(10);

Assertly defines `and` by default.

# Add-ons

Writing [add-ons](docs/Add-ons.md) is easy! In fact it is easier the Chai (imo)!

The "hello world" of extending the assertly words:

    const Assert = require('assertly');

    Assert.register({
        infinity (actual) {
            return typeof actual === 'number' && !isFinite(actual);
        }
    });

    expect(1 / 0).to.be.infinity();

## Known Add-ons

 - [assertly-sinon](https://github.com/dongryphon/assertly-sinon) [npm](https://www.npmjs.com/package/assertly-sinon)
