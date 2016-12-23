# Promises

Either or both of the `expected` and `actual` parameters can be promises (technically,
"then-ables"). These promises are resolved (using their `then` methods) before they are
consumed.

Assume there is an `ajax` method that downloads a file and returns a `Promise` that will
resolve to a String with the text content of that file. Then consider:

    expect(ajax('something.txt')).to.be('Some text');

The above assertion will wait for the `ajax()` method to resolve. To include assertions
like these in a test,