### empty

 - to[.not].be.empty

The `empty` assertion evaluates to `true` for empty strings, arrays or objects (as
well as `null` and `undefined`):

    expect([]).to.be.empty();
    expect({}).to.be.empty();
