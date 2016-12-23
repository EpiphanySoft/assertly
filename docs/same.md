The `same` assertion compares the `actual` and `expected` values much like `equal` in
that array elements and object properties are compared recursively. The difference is
that while `equal` uses the `==` operator (and hence allows for type conversions), the
`same` assertion uses `===` (like `be`).

This means that for non-arrays and non-objects, `same` is equivalent to `be`.

    expect(1).to.be.same('1');  // fails since 1 !== '1'

    expect(1).to.be.same(1);   // succeeds just like "to.be(1)"

For object and arrays, `same` compares corresponding properties and elements with the
same logic. In other words, the following passes for `equal` and fails for `same``:

    let a = {
        a: [ 2 ]
    };

    let b = {
        a: [ '2' ]
    }

    expect(a).to.equal(b);      // passes since 2 == '2'
    expect(a).to.be.same(b);    // fails because 2 !== '2'

Objects must have all the same keys and arrays must have exactly the same numbers of
elements.
