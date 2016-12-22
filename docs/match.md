The `match` assertion checks that the `actual` value match an expected `RegExp`.

For example:

    expect('WORLD').to.match(/world/i);

Further:

    expect(2).to.match(/\d+/);

The above works because the `actual` value (2 above) is first converted to a string.
