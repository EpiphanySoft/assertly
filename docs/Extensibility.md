# Extensibility

The [Assert](./Assert.md) class is primarily intended to be created as a worker object
by the public `expect` method. The `Assert` class can also be extended or customized.

## Registering Customizations

All of the modifiers and assertions are incorporated by the static `register` method.
This method accepts an object (called the "registry") that describes the allowed
modifiers, assertions and methods.

Consider this minimal form:

    Assert.register({
        to: true,  // simple modifiers
        not: true,

        be (actual, expected) {
            return actual === expected;
        },

        throw (fn, type) {
            try {
                fn();
            }
            catch (e) {
                //...
            }
        }
    });

The above registers two modifiers (`to` and `not`) and two assertions (`be` and
`throw`).

Given these, the following assertions can now be written:

    expect(4).to.be(4);
    expect(2).not.to.be(4);
    expect(2).to.not.be(4);

    expect(fn).to.throw(type);

    expect(fn).not.to.throw(type);
    expect(fn).to.not.throw(type);

### Modifiers

The registered modifiers (`to` and `not`) can be used in any order. Not all modifiers
have meaning to all assertions and some (like `to`) are simply to make the assertion
grammatically proper.

Modifiers can be accessed by an assertion method using `this._modifiers`. This object
holds the pieces of the dot-chain used to arrive at the assertion (this includes the
modifiers and the assertion method itself).

While one can access `this._modifiers.not` in the assertion method, this is not
recommended. This is because the truth result returned will be toggled based on this
modifier and so is not needed in the truth test.

When writing custom assertions, `Assert.Util` has some helpful [utility](./Utils.md)
methods.

## Advanced Configuration

The value of each property in the registry object is often a simple value (as shown
above and elaborated below), but the full, normalized form for a word is an object
like the following:

    Assert.register({
        word: {
            alias: ['alternate', 'other'], // other words that are equivalent

            evaluate (actual, expected) {
                // The presence of this method indicates "word" is an assertion.
                // It is called when the user makes a call like this:
                //
                //  expect(x).to.be.word(y);
                //        ^^^           ^^^
                //        actual        expected
                //
                // Receives as many "expected" arguments as are passed.
                //
                // Must return true for success, false for failure
                //
                // Cannot be combined with invoke().
            },

            explain (actual, expected) {
                // This optional method is only called for assertions. It can
                // adjust the explanation pieces stored on this Assert instance
                // or can return the full explanation. The arguments are the
                // same as for evaluate().
            },

            get (actual) {
                // The presence of this method indicates "word" can be used as
                // a dot-chain member but can return whatever it wants instead
                // of the Assert instance.
                //
                // It is called when the user makes a call like this:
                //
                //  expect(x).word.to...
                //        ^^^
                //        actual
                //
                // Receives only the "actual" value stored in the Assert instance.
                //
                // Can either return a new Assert or modify this Assert instance
                // or both.
            },

            invoke (actual, ...args) {
                // The presence of this method indicates "word" is an instance
                // method.
                //
                // It is called when the user makes a call like this:
                //
                //  expect(x).to.word(arg1, ...)...
                //        ^^^         ^^^
                //        actual      args
                //
                // Receives as many "args" as are passed.
                //
                // Can either return a new Assert or modify this Assert instance
                // or both.
                //
                // Cannot be combined with evaluate().
            },

            next (actual) {
                // The presence of this method indicates "word" is a conjunction
                // (like "and"). Conjunctions are used immediately following an
                // assertion.
                //
                // It is called when the user makes a call like this:
                //
                //  expect(x).to.be(y).word.to...
                //        ^^^
                //        actual
                //
                // In the above form, the method receives only the "actual" value.
                // If additional arguments are declared on this method, they must
                // be passed when using the conjunction:
                //
                //  expect(x).to.be(y).word(...args).to...
                //        ^^^
                //        actual
                //
                // These extra "args" follow the "actual" parameter to this methid.
                //
                // Must return the Assert instance to use going forward.
            }
        }
    });

These methods are explored more in the sections that follow.

### Registry Keys And Shorthands

The keys of the registry object (the object passed to `register`) can be used to give
the name and its aliases using a comma-delimited key:

    thing,alt,other
    \   / \       /
     \_/   \_____/
     name   aliases

When this is form is used, the canonical name is the first name and the second and
subsequent names are considered aliases.

When the value of a registry key is `true` that name and its aliases are treated as
modifiers. If the value is a method, that method is the `evaluate` method.

For example:

    Assert.register({
        'randomly,sporadically': true,

        throw (fn, type) {
            if (this._modifiers.randomly) {
                // well...
            }
            //...
        }
    });

Rewriting the example in normal form:

    Assert.register({
        randomly: {
            alias: ['sporadically'],
        }

        throw: {
            evaluate (fn, type) {
                if (this._modifiers.randomly) {
                    //...
                }
                //...
            }
        }
    });

The above adds the (not very helpful) `randomly` modifier and an alias `sporadically`.
The second key defines the `throw` assertion.

When using aliases, the `_modifiers` object will use the primary (canonical) name of
the modifier, even if the alias is used in an assertion. For example:

    expect(fn).to.sporadically.throw();  // sets this._modifiers.randomly

The `assertions` array, however, will contain the alias used in the assertion. See
below for details on this array.

### Explaining Assertions

The default mechanism for generating explanatory text for an assert is acceptable in
most cases. This is because it reads almost identically to the assertion in the code
itself. There are times, however, explanations can be improved with a little logic.

    Assert.register({
        christmas: {
            evaluate (value) {
                return value.getMonth() === 11 && value.getDate() === 25;
            },

            explain (value) {
                let y = value.getFullYear();
                let x = +value;
                let t = +new Date(y, 11, 25) - x;
                let not = this._modifiers.not ? 'not ' : '';

                if (t < 0) {
                    t = +new Date(y+1, 11, 25) - x;
                }

                t = Math.round(t / (24 * 60 * 60 * 1000));

                if (t) {
                    return `Expected ${t} days before Christmas ${not}to be Christmas`;
                }

                return `Expected Christmas ${not}to be Christmas`;
            }
        }
    });

The parameters passed to `explain` are the same as those passed to the assertion's
`evaluate` function, which are first the "actual" value (the one passed to `expect`)
and then the values passed in the assertion call.

The `this` pointer for an `explain` method is the `Assert` instance. The `explain`
method can (as above) return the full explanation. Alternatively, it can adjust the
properties that are normally concatenated. The following properties are stored on the
`Assert` instance for this purpose:

 - `actual` - A string with the printed (`Assert.print`) `value`.
 - `assertions` - A String[] of the modifiers followed by the assertion.
 - `expectation` - A string with the printed (`Assert.print`) `expected`.

The default explanation consists of:

    Expected ${actual} ${assertions.join(' ')} ${expectation}

For example:

    Expected 4 to be 2

### Custom Methods

Non-assertion, general purpose methods can be registered by setting the `invoke`
property:

    Assert.register({
        down: {
            invoke (actual, selector) {
                var c = actual.querySelector(selector);
                return new Assert(c);
            }
        }
    });

This would allow assertions like the following:

    expect(el).down('div.foo').to.be.truthy();

It is illegal to combine `invoke` and `evaluate` in the same definition.

### Custom Getters

At times it can be convenient for the property getter syntax to "navigate" from the
base value assertion. Perhaps in a DOM assertion module one might want to say:

    expect(el).firstChild.to.be.tag('div').
        and.to.have.class('some-css-class');

To implement a `firstChild` property like the above, a custom getter is needed:

    Assert.register({
        firstChild: {
            get (actual) {
                return new Assert(actual.firstChild);
            }
        }
    });

When a `get` function returns something, the modifier is not tracked in the
`_modifiers` set.

### Combining Getters And Assertions

When an assertion (or a method) also has a `get` defined, the timing is a bit different
to allow the code to either execute the method or descend further down the dot-path.

Consider:

    expect('abc').to.have.length(3);

    expect('abc').to.have.length.above(2);

In the first case, the `length` assert is called and so its `get` function is not
called, only `evaluate` is called.

In the second case, since `length` is simply a modifier, its `get` function is called
(but only because `above` was requested).

The definition of the `length` method is basically like this:

    Assert.register({
        length: {
            evaluate (actual, expected) {
                return expected === actual ? actual.length : NaN;
            },

            get (actual) {
                this.value = actual ? actual.length : NaN;
            }
        }
    });

When `get` is called, it simply adjusts `this.value` of the assertion to be that of
the `length` property. This has the desired affect of influencing whatever is the
eventual assertion method.

While the above example relates to the `evaluate` function, the same applies to the
`invoke` function as well.

### Custom Conjunctions

By default, the `and` conjunction allows assertions to be conveniently chained and
the "actual" value passed forward:

    expect(x).to.be.above(10).and.below(20);

To define a custom conjunction, you can implement a `next` method. The following
example implements an `also` conjunction that works in the same way as `and`:

    Assert.register({
        also: {
            next (value) {
                // We get the actual value and the Assert instance (as "this")
                return new Assert(value, this);
            }
        }
    });

With the above, the following assertion can be used:

    expect(x).to.be.above(10).also.to.be.below(20);

A conjunction can take more arguments then the actual `value` if needed:

    Assert.register({
        also: {
            multiplied (value, by) {
                return new Assert(value * by, this);
            }
        }
    });

With the above, the following assertion can be used:

    expect(x).to.be.above(10).multiplied(3).to.be.below(20);

When a conjunction declares more arguments the the `value` it must always be called
when used. Its name alone will only return the conjunction method.

## Adjusting The Defaults

The above examples are overly simplistic since they replace the standard modifiers
and assertions by only registering customizations.

A more realistic approach:

    let registry = Assert.getDefaults();

    // registry looks like the above object

    Assert.register(registry);

This sequence is performed automatically when the first `Assert` instance is created,
but only if no registrations have been made. An easy way to adjust the dot-chains and
make additions or removals is to edit the object returned by `getDefaults`. The object
returned by `getDefaults` is always fully normalized to simplify this task.

### Replacing Assertions

When an assertion is already registered, calling `register` again will replace it.
The original assertion function and its `explain` method are preserved on the new
functions.

For example:

    Assert.setup(); // initialize with defaults

    // Take over nan assertion (which has an explain)
    Assert.register({
        nan: {
            evaluate: function fn (actual, expected) {
                let r = fn._super.call(this, actual, expected);
                return r;
            },

            explain: function fn (actual, expected) {
                let r = fn._super.call(this, actual, expected);
                return r;
            }
        }
    });

The `_super` property is stored on the function objects to form a chain. The odd
syntax of declaring a named method is needed only when access to these replaced
functions is desired.

## Extending Assert

The `Assert` class can also be extended to make customizations.

    class MyAssert extends Assert {
        static expect (value) {
            return new MyAssert(value);
        }

        static getDefaults () {
            let registry = super.getDefaults();

            // hack away

            return registry;
        }
    }

This is similar to adjusting `Assert` itself, but obviously a bit safer if one is
planning to combine test suites with those developed by others (though not a very
common practice).

As a derived class, it is also possible to implement the [Lifecycle](./Lifecycle.md)
methods and customize these behaviors.

### Add-ons

You can use [add-ons](./Add-ons.md) with such classes in the same way as `Assert`
itself:

    const addon = require('my-assertly-addon');

    MyAssert.register(addon.init);
