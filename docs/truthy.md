### truthy (aka: "ok")

 - to[.not].be.truthy

The `truthy` assertion ensures that the `actual` value is "true-like". In other
words, that it would satisfy an `if` test.

For example:

    expect(x).to.be.truthy();

The above is equivalent to:

    expect(!!x).to.be(true);
