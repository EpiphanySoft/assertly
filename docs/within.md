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
