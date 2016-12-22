# assertly
Assert class for BDD-style assertions.

Assertly was inspired by [expect.js](https://github.com/Automattic/expect.js) and implements
almost the same interface. Some additional inspiration for assertions came from the
[Chai Assert](http://chaijs.com/api/assert/) and [Chai BDD](http://chaijs.com/api/bdd/)
API's as well.

There are some additional goals, however, that led to this library:

 - [Extensibility](docs/Extensibility.md)
 - [Integration](docs/Integration.md)
 - [Promises](docs/Promises.md)

# API

## Modifiers

### not

The `not` modifier simply negates the result of the test. This is somewhat different
then [expect.js](https://github.com/Automattic/expect.js) in some cases, but pure
negation seems much more intuitive.

### only / own

These modifiers apply to `keys` and `property` assertions to restrict what is allowed
to match the criteria. The `only` modifier restricts the assertion such that it will
fail if other keys or properties are present.

The `own` modifier restricts consideration to "own properties" (as in `hasOwnProperty()`).
All inherited properties are ignored when `own` is specified.

## Assertions

Following are the assertion methods and their common aliases ("aka" = "also known as").
The remainder of this document can be regenerated using:

    npm run print >> README.md

### a (aka: "an")

 - to[.not].be.a

The `a` or (`an`) assertion is useful for type matching. For example:

    expect(a).to.be.an('array');
    expect(b).to.be.a('boolean');

Type names are derived from `Object.prototype.toString`.

Alternatively, a constructor can be passed:

    class T {
        // ...
    }

    var t = new T();
    expect(t).to.be.a(T);

The above is equivalent to:

    expect(t instanceof T).to.be(true);


### approx (aka: "approximately")

 - to[.not].be.approx

The `approx` assertion supports the following forms:

    approx (value, epsilon = 0.001);

The value of `epsilon` is the maximum allowed difference between the `actual` and the
`expected` values.

For example,

    expect(2.00001).to.be.approx(2);


### be

 - to[.not].be

The `be` assertion matches values strictly using `===`:

    expect(1).to.be(1);    // ok!
    expect(1).to.be('1');  // fail!


### contain

 - to[.not].contain

The `contain` assertion matches based on the `indexOf` method and is this suitable
for strings or arrays.

For example:

    expect([1, 2, 3]).to.contain(2);

    expect('Hello').to.contain('el');


### empty

 - to[.not].be.empty

The `empty` assertion evaluates to `true` for empty strings, arrays or objects (as
well as `null` and `undefined`):

    expect([]).to.be.empty();
    expect({}).to.be.empty();


### equal

 - to[.not].equal

The `equal` assertion compares the `actual` and `expected` values using `==`. This means
that type conversions will be applied:

    expect(1).to.equal('1');

For object and arrays, `equal` compares corresponding properties and elements with the
same logic. In other words, the following passes:

    let o = {
        a: [ 2 ]
    };

    expect(o).to.equal({ a: [ '2' ] });

Objects must have all the same keys and arrays must have exactly the same numbers of
elements.


### greaterThan (aka: "above", "gt")

 - to[.not].be.greaterThan

The `greaterThan` assertion compares values using `>`.

For example:

    expect(4).to.be.greaterThan(2);

There is also the `gt` alias for brevity:

    expect(4).to.be.gt(2);


### greaterThanOrEqual (aka: "atLeast", "ge", "gte")

 - to[.not].be.greaterThanOrEqual

The `greaterThanOrEqual` assertion compares values using `>=`.

For example:

    expect(4).to.be.greaterThanOrEqual(2);

There is also the `ge` alias for brevity:

    expect(4).to.be.ge(2);


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


### key (aka: "keys")

 - to[.not].only.have.own.key
 - to[.not].only.have.key
 - to[.not].have.own.key
 - to[.not].have.only.own.key
 - to[.not].have.only.key
 - to[.not].have.key

The `key` or `keys` assertion checks that a given set of property names ("keys") are
present on the given value.

For example:

    let o = { a: 1 };

    expect(o).to.have.key('a');

You can check for multiple keys as well:

    let o = { a: 1, b: 2 };

    expect(o).to.have.keys('a', 'b');

You can combined this with `own` to filter out inherited properties:

    let a = { a: 1 };
    let b = Object.create(a);

    expect(b).to.have.own.key('a');  // fails because "a" is inherited

The `only` modifier is also useful to ensure that no other keys are present.

For example:

    let o = { a: 1, b: 2 };

    expect(o).to.only.have.key('a');  // fails because "b" is also present

Of course these can be combined:

    let a = { a: 1 };
    let b = Object.create(a);

    b.b = 2;

    expect(b).to.have.only.own.key('a');

This assertion succeeds because, while "b" inherits the "a" property, "b" is the
only "own" property (as defined by `hasOwnProperty`).


### length

 - to[.not].only.have.length
 - to[.not].have.length

This assertion checks that the `length` property is a certain value.

For example:

    expect(x).to.have.length(4);

The above is equivalent to:

    expect(x).to.have.property('length', 4);


### lessThan (aka: "below", "lt")

 - to[.not].be.lessThan

The `lessThan` assertion compares values using `<`.

For example:

    expect(2).to.be.lessThan(4);

There is also the `lt` alias for brevity:

    expect(2).to.be.lt(4);


### lessThanOrEqual (aka: "atMost", "le", "lte")

 - to[.not].be.lessThanOrEqual

The `lessThanOrEqual` assertion compares values using `<=`.

For example:

    expect(2).to.be.lessThanOrEqual(4);

There is also the `le` alias for brevity:

    expect(2).to.be.le(4);


### match

 - to[.not].match

The `match` assertion checks that the `actual` value match an expected `RegExp`.

For example:

    expect('WORLD').to.match(/world/i);

Further:

    expect(2).to.match(/\d+/);

The above works because the `actual` value (2 above) is first converted to a string.


### nan (aka: "NaN")

 - to[.not].be.nan

The `nan` assertion ensures that a value `isNaN()`.

For example:

    expect(x).to.be.nan();

The above is equivalent to:

    expect(isNaN(x)).to.be(true);


### property

 - to[.not].only.have.own.property
 - to[.not].only.have.property
 - to[.not].have.own.property
 - to[.not].have.only.own.property
 - to[.not].have.only.property
 - to[.not].have.property

The `property` assertion is very similar to the `key`/`keys` assertion. The difference
being that while `keys` can check for the presence of multiple properties, this assertion
instead can check that a property has a particular value.

For example:

    let o = { a: 1 };

    expect(o).to.have.property('a');     // same as to.have.key('a')
    expect(o).to.have.property('a', 1);  // checks that o.a === 1

Also, as with `key`, the `own` and `only` modifiers can be added to tighten the check.


### same

 - to[.not].be.same

The `same` assertion compares the `actual` and `expected` values much like `equal` in
that array elements and object properties are compared recursively. The difference is
that while `equal` uses the `==` operator (and hence allows for type conversions), the
`same` assertion uses `===` (like `be`).

This means that for non-arrays and non-objects, `same` is equivalent to `be`.

    expect(1).to.equal('1');  // fails since 1 !== '1'

    expect(1).to.equal(1);   // succeeds just like "to.be(1)"

For object and arrays, `equal` compares corresponding properties and elements with the
same logic. In other words, the following passes for `equal` and fails for `same``:

    let a = {
        a: [ 2 ]
    };

    let b = {
        a: [ '2' ]
    }

    expect(a).to.equal(b);      // passes since 2 == '2'
    expect(a).to.be.same(b);    // fails because 2 !== '2'

Objects must have all the same keys and arrays must have exactly the same numbers of
elements.


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


### truthy (aka: "ok")

 - to[.not].be.truthy

The `truthy` assertion ensures that the `actual` value is "true-like". In other
words, that it would satisfy an `if` test.

For example:

    expect(x).to.be.truthy();

The above is equivalent to:

    expect(!!x).to.be(true);


### within

 - to[.not].be.within

The `within` assertion supports the following forms:

    within (min, max, constraint="[]");
    within (range);

For example,

    expect(5).to.be.within(1, 10);

Equivalently, and more clearly, one can use mathematical notation to
indicate the open/closed-ness of the extrema:

    expect(5).to.be.within('[1,10]');  // closed/closed or 1 <= 5 <= 10

In this notation, a closed minimum uses "[" and a closed maximum uses "]" as
shown above. An open minimum uses "(" while an open maximum uses ")". Closed
extrema are consider "in" the range, while open extrema are not.

For example, a commonly useful form of geometric ranges is open/closed:

    expect(5).to.be.within('[1,10)');  // 1 <= 5 < 10

The `constraint` string is simply the notation without the values:

 - `"[]"` for closed/closed
 - `"[)"` for closed/open
 - `"(]"` for open/closed
 - `"()"` for open/open

This form is useful when the extrema are known in variable form:

    expect(z).to.be.within(x, y, '[)');  // x <= z < y
