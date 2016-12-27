# Extensibility

The [Assert](./Assert.md) class is primarily intended to be created as a worker object
by the public `expect` method. The `Assert` class can also be extended or customized.

## Registering Customizations

All of the modifiers and assertions are incorporated by the static `register` method.
This method accepts an object (called the "registry") that describes the allowed
modifiers and their sequence as well as the assertion functions.

Consider this minimal form:

    Assert.register({
        to: 'not',  // to.not is allowed
        not: 'to'.  // not.to is allowed

        be (actual, expected) {
            // "actual" (arguments[0]) is the value passed to expect()
            // the rest of the arguments cme from the call to the assertion
            // "this" is the Assert instance

            return actual === expected;
        }
    });

The above modifiers (`to` and `not`) and assertion (`be`) have some special handling
in the registration process.

 - Modifiers default to being allowed to start the dot-chain.
 - Assertions default to following after `be`.
 - The `be` assertion defaults to following after `to`.
 - Modifiers and asserts that follow `to` can also follow `not`.

### Assertions

With the basics in place, the following adds a new assertion (`throw`):

    Assert.register({
        'to.throw' (fn, type) {
            //...
        }
    });

The `throw` assertion follows the `to` modifier (it would have defaulted to `be`). The
above enables these assertions:

    expect(fn).to.throw(type);

    expect(fn).not.to.throw(type);
    expect(fn).to.not.throw(type);

The `this` pointer when an assertion is called in the `Assert` instance. The most
likely property to use is the `_modifiers` object which hold the pieces of the dot-chain
used to arrive at the assertion (this includes the modifiers and the assertion method
itself).

While one can access `this._modifiers.not` in the assertion method, this is not
recommended. This is because the truth result returned will be toggled based on this
modifier and so is not needed in the truth test.

When writing custom assertions, `Assert.Util` has some helpful [utility](./Utils.md)
methods.

#### Explaining Assertions

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

For example:

    expect(x).to.be.foo(y, z);

    // ...

    Assert.register({
        foo: {
            evaluate (x, y, z) {
                // truth test
            },

            explain (x, y, z) {
                // explain the truth test
            }
        }
    });

The `this` pointer for an `explain` method is the `Assert` instance. Again, the most
likely property to use is `_modifiers`.

The `explain` method can (as above) return the full explanation. Alternatively, it
can adjust the properties that are normally concatenated. The following properties
are stored on the `Assert` instance for this purpose:

 - `actual` - A string with the printed (`Assert.print`) `value`.
 - `assertions` - A String[] of the modifiers followed by the assertion.
 - `expectation` - A string with the printed (`Assert.print`) `expected`.

The default explanation consists of:

    Expected ${actual} ${assertions.join(' ')} ${expectation}

For example:

    Expected 4 to be 2

### Modifiers

Modifiers are added in basically the same way as assertions:

    Assert.register({
        'to.randomly': true,

        'to,randomly.throw' (fn, type) {
            if (this.modifiers.randomly) {
                //... hmmm
            }
            //...
        }
    });

The above adds the (not very helpful) `randomly` modifier. The first key `to.randomly`
allows `randomly` to follow the `to` modifier (by default it would belong at the start
of the dot-chain). The second key defines the `throw` assertion and it can now be
used after `to` or after `randomly`.

### Registry Keys

As shown above, the keys of the registry object (the object passed to `register`) can
contain some special syntactic forms.

For a complete example:

    foo,bar,zip.thing,alt,other.blerp,derp
    \         / \   / \       / \        /
     \_______/   \_/   \_____/   \______/
      before    name   aliases    after

The key is first split on `'.'` (or alternatively `'|'` or `'/'` for readability).
For example:

    foo,bar,zip|thing,alt,other|blerp,derp

    // or

    foo,bar,zip/thing,alt,other/blerp,derp

If there is only one element, that element is the name and its possible alternate
aliases.

If there are two or more elements in the split, the first element is the **before**
collection and the second is the name and aliases. The set of **before** values are
those words that come _before_ the word being defined. As with 'to.randomly' above,
the 'to' is a **before** for the word 'randomly'.

Only if there are three parts in the split does the **after** set come into play.
This set is the names that can come _after_ this name.

All sets of names can be comma-delimited. When this is applied to the primary name,
the second and subsequent names are considered aliases.

### Advanced Configuration

The value of each property in the registry object is often a simple value, but its
full, normalized form is an object with the following properties:

 - `alias` - The array of alternate names (e.g. "a" and "an").
 - `after` - The array of names that come _after_ this name.
 - `before` - The array of names that come _before_ this name.
 - `evaluate` - The assertion `Function` that will return `true` for success.
 - `explain` - The `Function` that will return a string explaining the assertion.

Rewriting the 'to.randomly' in normal form:

    Assert.register({
        randomly: {
            before: ['to']
        },

        throw: {
            before: ['to', 'randomly'],
            evaluate (fn, type) {
                if (this.modifiers.randomly) {
                    //... hmmm
                }
                //...
            }
        }
    });

Rewriting the complete example:

    foo,bar,zip|thing,alt,other|blerp,derp

Would look like this:

    Assert.register({
        thing: {
            alias: ['alt', 'other' ],
            before: ['foo', 'bar', 'zip']
            after: ['blerp', 'derp']
        }
    });

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
