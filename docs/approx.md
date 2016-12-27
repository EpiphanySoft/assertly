### approx (aka: "approximately")

 - to[.not].be.approx

The `approx` assertion supports the following forms:

    approx (value, epsilon = 0.001);

The value of `epsilon` is the maximum allowed difference between the `actual` and the
`expected` values.

For example,

    expect(2.00001).to.be.approx(2);
