# Add-ons

An add-on is a module that exports an initializer function that (when called) uses
the [extensibility](./Extensibility.md) features of Assertly to provide its
customizations.

Using an add-on looks like this:

    // Step 0 - Load up assertly
    const Assert = require('assertly');
    const expect = Assert.expect;

    // Step 1 - Load the add-on module:
    const addon = require('assertly-infinity-add-on');

    // Step 2 - Register the add-on:
    Assert.register(addon.init);

That's it. Now we can use the add-on's features.

For example:

    expect(1 / 0).to.be.infinity();

On Step 2, the exact exported method may differ but `init` is the recommended
method to export for add-ons.

## Writing An Add-On

The signature of the initializer method is shown in the following simple add-on
module:

    module.exports.init = function (Assert, utils) {
        Assert.register({
            infinity (actual) {
                return typeof actual === 'number' && !isFinite(actual);
            }
        });
    };

When the user of the add-on passes the `init` method to `Assert.register()`, the
function is simply called.

The `init` method receives the `Assert` class and some helpful [utility](./Utils.md)
methods (the `utils` argument). It should then make calls to `Assert.register` to
provide additional features.

### Adding Modifiers

Many add-ons will want to add modifiers as well as assertions. The following example
adds `positive` and `negative` modifiers to our add-on:

    module.exports.init = function (Assert, utils) {
        Assert.register({
            positive: true,
            negative: true,

            infinity (actual) {
                if (typeof actual !== 'number' || isFinite(actual)) {
                    return false;
                }

                if (this._modifiers.positive) {
                    return actual > 0;
                }

                if (this._modifiers.negative) {
                    return actual < 0;
                }

                return true;
            }
        });
    };

With the above, the following assertions can now be written:

    expect(1 / 0).to.be.positive.infinity();

    expect(-1 / 0).to.be.negative.infinity();

### Using expect

It is important that an add-on `init` method only use the `Assert` and `Util`
references passed to it. The add-on should not `require('assertly')` itself and use
that module. This is because the user of the add-on may have extended `Assert` and
passed that derived class instead of the base `Assert`.

For example, to use `expect` in an add-on:

    module.exports.init = function (Assert, utils) {
        Assert.register({
            infinity (actual) {
                Assert.expect(actual).to.be.a('number');

                return !isFinite(actual);
            }
        });
    };

Alternatively, `bind()` can simplify things if `expect` is used often:

    module.exports.init = function (Assert, utils) {
        const expect = Assert.expect.bind(Assert); // preserve the class

        Assert.register({
            infinity (actual) {
                expect(actual).to.be.a('number');

                return !isFinite(actual);
            }
        });
    };

## Next Steps

For more information on writing the contents of an add-on, see
[Extensibility](./Extensibility.md).
