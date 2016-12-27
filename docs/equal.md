### equal

 - to[.not].equal

The `equal` assertion compares the `actual` and `expected` values using `==`. This means
that type conversions will be applied:

    expect(1).to.equal('1');

For object and arrays, `equal` compares corresponding properties and elements with the
same logic. In other words, the following passes:

    let o = {
        a: [ 2 ]
    };

    expect(o).to.equal({ a: [ '2' ] });

Objects must have all the same keys and arrays must have exactly the same numbers of
elements.
