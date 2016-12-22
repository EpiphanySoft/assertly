# assertly
Assert class for BDD-style assertions.

Assertly was inspired by [expect.js](https://github.com/Automattic/expect.js) and implements
almost the same interface. There are some additional goals, however, that led to this
library:

 - Extensibility
 - Integration
 - Promises

# API

## Modifiers

### not

### only

### own

## Assertions

### a (aka: "an")

 - to[.not].be.a

The `a` or (`an`) assertion is useful for type matching. For example:

    expect(a).to.be.an('array');
    expect(b).to.be.a('boolean');

Alternatively, a constructor can be passed:

    class T {
        // ...
    }

    expect(new T()).to.be.a(T);

Type names are derived from `Object.prototype.toString`.


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

    expect(o).to.equal({ a: [ '2' ] }

Objects must have all the same keys and arrays must have exactly the same numbers of
elements.


### greaterThan (aka: "above", "gt")

 - to[.not].be.greaterThan

The `greaterThan` assertion 

### greaterThanOrEqual (aka: "atLeast", "ge", "gte")

 - to[.not].be.greaterThanOrEqual

TODO

### in

 - to[.not].be.in

TODO

### key (aka: "keys")

 - to[.not].only.have.own.key
 - to[.not].only.have.key
 - to[.not].only.own.key
 - to[.not].only.key
 - to[.not].have.own.key
 - to[.not].have.only.own.key
 - to[.not].have.only.key
 - to[.not].have.key

TODO

### length

 - to[.not].only.have.length
 - to[.not].have.length

TODO

### lessThan (aka: "below", "lt")

 - to[.not].be.lessThan

TODO

### lessThanOrEqual (aka: "atMost", "le", "lte")

 - to[.not].be.lessThanOrEqual

TODO

### match

 - to[.not].match

TODO

### nan (aka: "NaN")

 - to[.not].be.nan

TODO

### property

 - to[.not].only.have.own.property
 - to[.not].only.have.property
 - to[.not].only.own.property
 - to[.not].only.property
 - to[.not].have.own.property
 - to[.not].have.only.own.property
 - to[.not].have.only.property
 - to[.not].have.property

TODO

### same

 - to[.not].be.same

TODO

### throw

 - to[.not].throw

TODO

### truthy (aka: "ok")

 - to[.not].be.truthy

TODO

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
