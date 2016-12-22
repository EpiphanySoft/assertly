The `contain` assertion matches based on the `indexOf` method and is this suitable
for strings or arrays.

For example:

    expect([1, 2, 3]).to.contain(2);

    expect('Hello').to.contain('el');
