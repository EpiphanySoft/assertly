The `nan` assertion ensures that a value `isNaN()`.

For example:

    expect(x).to.be.nan();

The above is equivalent to:

    expect(isNaN(x)).to.be(true);
