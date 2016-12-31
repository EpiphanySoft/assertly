### be

 - to[.not].be

The `be` assertion matches values strictly using `===`:

    expect(1).to.be(1);    // ok!
    expect(1).to.be('1');  // fail!
