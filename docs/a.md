The `a` or (`an`) assertion is useful for type matching. For example:

    expect(a).to.be.an('array');
    expect(b).to.be.a('boolean');

Alternatively, a constructor can be passed:

    class T {
        // ...
    }

    expect(new T()).to.be.a(T);

Type names are derived from `Object.prototype.toString`.
