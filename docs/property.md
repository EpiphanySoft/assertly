### property

 - to[.not].only.have.own.property
 - to[.not].only.have.property
 - to[.not].have.own.property
 - to[.not].have.only.own.property
 - to[.not].have.only.property
 - to[.not].have.property

The `property` assertion is very similar to the `key`/`keys` assertion. The difference
being that while `keys` can check for the presence of multiple properties, this assertion
instead can check that a property has a particular value.

For example:

    let o = { a: 1 };

    expect(o).to.have.property('a');     // same as to.have.key('a')
    expect(o).to.have.property('a', 1);  // checks that o.a === 1

Also, as with `key`, the `own` and `only` modifiers can be added to tighten the check.
