This assertion checks that the `length` property is a certain value.

For example:

    expect(x).to.have.length(4);

The above is equivalent to:

    expect(x).to.have.property('length', 4);
