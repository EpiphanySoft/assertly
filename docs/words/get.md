# get

The `get` method is used to target a property of the current assertion's value (i.e.,
it "actual" value) with a new assertion.

For example:

    let o = { a: 4 };

    expect(o).get('a').to.be(4);

The above is roughly equivalent to:

    expect(o.a).to.be(4);

The difference is that `get` produces `undefined` as the actual value if the current
value cannot be indexed. For example:

    expect(undefined).get('a').to.be(undefined);
