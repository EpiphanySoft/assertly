The `key` or `keys` assertion checks that a given set of property names ("keys") are
present on the given value.

For example:

    let o = { a: 1 };

    expect(o).to.have.key('a');

You can check for multiple keys as well:

    let o = { a: 1, b: 2 };

    expect(o).to.have.keys('a', 'b');

You can combined this with `own` to filter out inherited properties:

    let a = { a: 1 };
    let b = Object.create(a);

    expect(b).to.have.own.key('a');  // fails because "a" is inherited

The `only` modifier is also useful to ensure that no other keys are present.

For example:

    let o = { a: 1, b: 2 };

    expect(o).to.only.have.key('a');  // fails because "b" is also present

Of course these can be combined:

    let a = { a: 1 };
    let b = Object.create(a);

    b.b = 2;

    expect(b).to.have.only.own.key('a');

This assertion succeeds because, while "b" inherits the "a" property, "b" is the
only "own" property (as defined by `hasOwnProperty`).
