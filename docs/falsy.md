The `falsy` assertion ensures that the `actual` value is "false-like". In other
words, that it would fail an `if` test.

For example:

    expect(x).to.be.falsy();

The above is equivalent to:

    expect(!x).to.be(true);
