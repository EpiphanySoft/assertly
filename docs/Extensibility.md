# Extensibility

The [Assert](./Assert.md) class is primarily intended to be created as a worker object
by the public `expect` method. The `Assert` class is also designed, however, to allow
for derivation and customization.

## Registering Customizations

All of the modifiers and assertions are incorporated by the static `register` method.
This method accepts an object that describes the allowed modifiers and their sequence
as well as the assertion functions.

Consider this minimal form:

    Assert.register({
        to: 'not',  // to.not is allowed
        not: 'to'.  // not.to is allowed

        be (actual, expected) {
            // "actual" (arguments[0]) is the value passed to expect()
            // the rest of the arguments cme from the call to the assertion

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

### Modifiers

Modifiers are added in the same way:

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

### Advanced Configuration

The value of each property passed to `register` is often a simple value, but its full
and normalized form is an object with the following properties:

 - `alias` - The array of alternate names (e.g. "a" and "an").
 - `after` - The array of names that this name comes after.
 - `before` - The array of names that this name comes before.
 - `fn` - The assertion `Function` that will return `true` for success.
 - `explain` - The `Function` that will return a string explaining the assertion.

Rewriting the above in fully normal form:

    Assert.register({
        randomly: {
            after: ['to']
        },

        throw: {
            after: ['to', 'randomly'],
            fn (fn, type) {
                if (this.modifiers.randomly) {
                    //... hmmm
                }
                //...
            }
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
