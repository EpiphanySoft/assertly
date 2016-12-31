### in

 - to[.not].be.in

The `in` assertion determines if the `actual` value is present using `indexOf`. This
enables both strings and arrays to be used as values.

For example:

    expect('def').to.be.in('abcdefgh');

    expect(2).to.be.in([1, 2, 3, 4]);

The above statements are equivalent to these:

    expect('abcdefgh'.indexOf('def')).to.be.ge(0);

    expect([1, 2, 3, 4].indexOf(2)).to.be.ge(0);
