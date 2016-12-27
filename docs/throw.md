### throw

 - to[.not].throw

The `throw` assertion ensures that a function throws an exception.

For example:

    function foo () {
        throw new Error('Some error');
    }

    expect(foo).to.throw();

The error message can also be checked:

    expect(foo).to.throw('Some error');
