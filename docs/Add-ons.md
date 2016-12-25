# Add-ons

An add-on is a module that exports an initializer function that (when called) uses
the [extensibility](./Extensibility.md) features of Assertly to provide its
customizations.

The signature of initializer method is shown in the following simple add-on module:

    module.exports.init = function (Assert, utils) {
        Assert.register({
            infinite (actual) {
                return typeof actual === 'number' && !isFinite(actual);
            }
        });
    };

Using an add-on takes two steps:

    // Require the things:
    const addon = require('addon');
    const Assert = require('assertly');
    const expect = Assert.expect;

    // Register the add-on:
    Assert.register(addon.init);

    // Now we can use it:
    expect(Infinity).to.be.infinite();

The `register` method recognizes that a function was passed, and calls that function
providing itself and some helpful [utility](./Utils.md) methods (the `utils` argument).

For help on writing the contents of an add-on, see [Extensibility](./Extensibility.md).
