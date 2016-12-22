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
