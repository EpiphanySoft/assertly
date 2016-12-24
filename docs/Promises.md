# Promises

Either or both of the `expected` and `actual` parameters can be promises (technically,
"then-ables"). These promises are resolved (using their `then` methods) before they are
consumed.

To illustrate, assume there is an `ajax` method that downloads a file and returns a
`Promise` that resolves to a String with the text content of that file.

Then consider:

    expect(ajax('something.txt')).to.be('Some text');

The above assertion will wait for the `ajax()` method to resolve. To be useful in a unit
test, such assertions need to inform the test runner about their eventual completion.

While this depends on the test runner in question, there are some common ways this can
be accomplished. This technique works for Jasmine and Mocha:

    it('should work asynchronously', function (done) {
        expect(ajax('something.txt')).to.be('Some text').then(() => {
            done();
        },
        done // Mocha (use "done.fail" for Jasmine)
        );
    });

Even better, using Mocha, a test can return a `Promise`:

    it('should work asynchronously', function () {
        return expect(ajax('something.txt')).to.be('Some text');
    });

When multiple assertions are used, these are internally sequenced so that assertions
are processed in the proper order.

Consider:

    it('should work asynchronously', function () {
        expect(ajax('something.txt')).to.be('Some text');

        return expect(ajax('other.txt')).to.be('Some other text');
    });

Internally, the first asynchronous assertion is tracked and the second chains its
work to the previous promise. This applies even if the second assertion is not (of its
own) asynchronous. Such as:

    it('should work asynchronously', function () {
        expect(ajax('something.txt')).to.be('Some text');

        return expect(2).to.be(2);
    });

Since the simple `expect(2).to.be(2)` assertion is synchronous, it would normally
complete immediately. The first assertion, however, is asynchronous which is tracked
to maintain the proper (FIFO) evaluation order. Because of this tracking, the second
assertion is implicitly asynchronous.

This tracking of the previous assertion is cleared when the last assertion either
resolves or rejects.

To see this in action, consider this adjusted version:

    it('should work asynchronously', function () {
        expect(ajax('something.txt')).to.be('Some text').then(() => {
                console.log('A');
            });

        return expect(2).to.be(2).then(() => {
                console.log('B');
            });
    });

The log statements will appear in "A" then "B" order as a side-effect of the internal
FIFO ordering of asynchronous assertions.

## Custom Promise Implementations

The native `Promise` constructor is feature detected and stored on the `Assert` class
for future use. All internal creation of promises will use this stored reference, which
means it can be replaced if needed.

For example:

    let Assert = require('assertly');

    Assert.Promise = require('custom-promise');

    ...

Of course, the custom `Promise` implementation must provide the standard interface
including `all` and `resolve` static methods as well as the standard constructor.
