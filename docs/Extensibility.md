# Extensibility

The [Assert](./Assert.md) class is primarily intended to be created as a worker object
by the public `expect` method. The `Assert` class is also designed, however, to allow
for derivation and customization.

## Registering Customizations

The `Assert.setup` static method is called internally when the first `Assert` instance
is created. This method calls `Assert.register` to define all of the various modifiers
and assertions.

### Modifiers

### Assertions

## Extending Assert
