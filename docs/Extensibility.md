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
            //...
        }
    });

The above add the (not very helpful) `randomly` modifier. The first key `to.randomly`
allows `randomly` to follow the `to` modifier. The second key defines the `throw`
assertion and it can now be used after `to` or after `randomly`.

### Sequence Control Using Keys

### Sequence Control Using `before` And `after`

## Extending Assert

The `Assert.setup` static method is called internally when the first `Assert` instance
is created. This method looks like this:

    this.register(this.getDefaults());
