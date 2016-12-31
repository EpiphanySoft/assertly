### throw

 - to[.not].throw

The `throw` assertion ensures that a function throws an exception.

For example:

    function foo () {
        throw new Error('Something bad happened');
    }

    expect(foo).to.throw();

The error message can also be checked:

    expect(foo).to.throw('Something bad happened');

When checking the message as above, the test defaults to a substring search. This
deals with error prefixing like "Error: Something bad happened" as well as suffixing
like "Something bad happened at line 3 of somefile".

To do a full message equality test, add the `exactly` modifier:

    expect(foo).to.exactly.throw('Something bad happened');
