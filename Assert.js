'use strict';

const BE = ['be'];
const ROOT = ['$'];
const TO = ['to'];

const arraySlice = Array.prototype.slice;
const toString = Object.prototype.toString;
const toStringMap = {};
const toStringRe = /^\[object ([^\]]+)]$/;
const useTypeOfRe = /booolean|number|string|undefined/;

/**
 * @class Assert
 */
class Assert {
    static expect (value) {
        let A = this || Assert; // use "this" to allow for derived class
        return new A(value);
    }

    constructor (value) {
        let me = this;

        me.modifiers = {};
        me.state = me._getEntry('$', false);
        me.value = value;

        if (!me.state) {
            me.constructor.setup();
            me.state = me._getEntry('$');
        }
    }

    assertion () {
        let me = this;
        let expected = me.expected;

        if (expected) {
            let result = !me.def.fn.call(me, me.value, ...expected);

            me.failed = me.modifiers.not ? !result : result;
        }
    }

    before (def) {
        this.def = def;
    }

    begin (expected) {
        let me = this;
        let A = me.constructor;
        let async = me.async;
        let previous = A._previous;

        if (previous && !async) {
            me.async = previous.async.then(() => {
                me.begin(expected);
                return me.async; // this is reassigned below
            },
            e => {
                if (A._previous === me) {
                    // If this is the end of the line of assertions, clean things up
                    A._previous = null;
                }

                throw e;
            });

            // This assert was made after some other async asserts, so get in line...
            A._previous = me;
        }
        else if (async || A._isPromise(me.value) || A._isPromise(...expected)) {
            me.async = A.Promise.all(expected.concat(me.value)).then(values => {
                me.expected = values;
                me.value = values.pop();

                if (A._previous === me) {
                    // If this is the end of the line of assertions, clean things up
                    A._previous = null;
                }

                me.assertion();
                me.report();
            },
            e => {
                if (A._previous === me) {
                    A._previous = null;
                }

                me.failure(e);
                me.report();
            });

            if (!async) {
                // This is the first async assert, so start the line with it...
                A._previous = me;
            }
        }
        else {
            me.expected = expected;
        }
    }

    failure (e) {
        this.failed = e;
    }

    explain () {
        let me = this;
        let def = me.def;
        let fn = def.explain;
        let exp = me.expected;
        let n = exp.length;

        const A = me.constructor;

        me.actual = A._print(me.value);
        me.expectation = me.expectation || (n ? A._print(n === 1 ? exp[0] : exp) : '');

        let mods = Object.keys(me.modifiers);

        me.assertions = mods;

        let ret = fn && fn.call(me, me.value, ...exp);

        if (!ret) {
            if (me.expectation) {
                mods.push(me.expectation);
            }

            ret = `Expected ${me.actual} ${mods.join(' ')}`;
        }

        return ret;
    }

    finish () {
        let me = this;
        let async = me.async;
        let A = me.constructor;
        let conjunction = {
            and: new A(me.value)
        };

        if (async) {
            conjunction.then = async.then.bind(async);
        }

        return conjunction;
    }

    static finish () {
        let prev = this._previous;

        this._previous = null;

        return prev && prev.async;
    }

    prop (name) {
        let v = this.value;

        v = v ? v[name] : undefined;

        return new this.constructor(v);
    }

    report () {
        let me = this;
        let failure = me.failed;

        if (me.hasOwnProperty('failed')) {
            if (failure === true) {
                me.failed = me.explain();
            }

            me.constructor.report(me);
        }
    }

    /**
     * Adds assertion methods.
     *
     *      Assert.register({
     *          to: ['be', 'have', 'include', 'only', 'not'],
     *
     *          lt: {
     *              test (actual, expected) {
     *                  return actual < expected;
     *              },
     *
     *              explain (actual, expected) {
     *                  let not = this.modifiers.not ? 'not ' : '';
     *                  return `Expected ${this.actual} to ${not}be less-than ${this.expected}`;
     *              }
     *          }
     *      });
     *
     *      Assert.expect(42).to.be.lt(427);
     *      //            ^^           ^^^
     *      //        actual           expected
     */
    static register (name, def) {
        const A = this;
        const P = A.prototype;

        if (typeof name !== 'string') {
            let names = Object.keys(name);

            names.forEach(key => A.register(key, name[key]));

            names = Object.keys(A.entries);
            for (let s of names) {
                if (s !== '$' && !Object.getOwnPropertyDescriptor(P, s)) {
                    A._addBit(P, s);
                }
            }

            return;
        }

        let after, before, entry;
        let fn = def;
        let t = typeof def;

        if (A.tupleRe.test(name)) {
            // 'afters.name,alias.befores'
            let tuples = name.split(A.tupleRe);
            let a = tuples.shift();
            name = tuples.shift();
            let b = tuples[0];

            before = b && b.split(',');
            after = a && a.split(',');
        }

        if (t === 'function') {
            def = { fn: fn };
        } else {
            fn = def.fn;
        }

        let names = name.split(',');
        name = names[0];

        after = after || (fn ? (name === 'be' ? TO : BE) : ROOT);
        if (after.indexOf('to') > -1 && after.indexOf('not') < 0) {
            after = ['not'].concat(after);
        }

        if (t === 'string' || Array.isArray(def)) {
            for (let s of names) {
                A._addBit(P, s, name);
                //A._getEntry('$').add(s);
                for (let a of after) {
                    entry = A._getEntry(a);
                    entry.add(s);
                }

                entry = A._getEntry(s, name);
                entry.add(def);
            }

            return;
        }

        let wrap = fn && A.wrapAssertion(def);

        for (let s of names) {
            entry = A._getEntry(s, name);
            entry.add(before);

            if (fn) {
                entry.fn = wrap;
                A._addFn(P, s, wrap);
            }
            else {
                A._addBit(P, s, name);
            }

            for (let a of after) {
                entry = A._getEntry(a);
                entry.add(s);
            }
        }
    } // register

    static report (assertion) {
        let failure = assertion.failed;

        if (this.log) {
            this.log.push(assertion);
        }

        if (failure) {
            this.reportFailure(failure, assertion);
        }
    }

    static reportFailure (msg) {
        //console.error(msg);
        throw new Error(msg);
    }

    static setup () {
        const A = this;

        A.register({
            not: ['to'],
            to:  ['not'],

            'to.only': ['have', 'own'],
            'to.have': ['own', 'only'],

            'a,an': {
                fn (actual, expected) {
                    let te = A.typeOf(expected);
                    let re = te === 'regexp';

                    if (!re && te !== 'string') {
                        return actual instanceof expected;
                    }

                    let t = A.typeOf(actual);

                    if (re) {
                        return expected.test(t); // ex expect(2).to.be.a(/number|string/);
                    }

                    return t === expected; // ex expect(2).to.be.a('number');
                },
                explain (object, type) {
                    if (typeof type === 'string') {
                        this.expectation = type;
                    }
                }
            },

            'approx,approximately': {
                fn (actual, expected, epsilon) {
                    epsilon = epsilon || 0.001;

                    A.expect(actual).to.be.a('number');
                    A.expect(expected).to.be.a('number');
                    A.expect(epsilon).to.be.a('number').and.to.be.gt(0);

                    let delta = Math.abs(actual - expected);
                    return delta <= epsilon;
                },
                explain (actual, expected, epsilon) {
                    epsilon = epsilon || 0.001;

                    this.assertions.pop(); // remove "approximately"
                    this.expectation = `${A._print(expected)} ± ${A._print(epsilon)}`;
                }
            },

            be (actual, expected) {
                return actual === expected;
            },

            'to.contain' (actual, expected, at) {
                let i = actual.indexOf(expected);
                if (at != null) {
                    return i === at;
                }
                return i > -1;
            },

            empty (actual) {
                let ret = actual == null,
                    t;

                if (!ret) {
                    t = typeof actual;

                    if (t === 'string' || A.isArrayLike(actual)) {
                        ret = !actual.length;
                    }
                    else if (t === 'object') {
                        ret = true;

                        for (t in actual) {
                            ret = false;
                            break;
                        }
                    }
                }

                return ret;
            },

            'to.equal' (actual, expected) {
                return A.isEqual(actual, expected);
            },

            'greaterThan,gt,above' (actual, expected) {
                return actual > expected;
            },

            'greaterThanOrEqual,atLeast,ge,gte' (actual, expected) {
                return actual >= expected;
            },

            in (actual, set) {
                return set.indexOf(actual) > -1;
            },

            'have,own,only/key,keys' (actual, ...expected) {
                let ok = true;
                let only = this.modifiers.only;
                let own = this.modifiers.own;
                let keyMap = only && {};

                expected.forEach(key => {
                    if (ok) {
                        if (keyMap) {
                            keyMap[key] = true;
                        }

                        ok = own ? actual.hasOwnProperty(key) : (key in actual);
                    }
                });

                if (ok && only) {
                    for (let key in actual) {
                        if (!own || actual.hasOwnProperty(key)) {
                            if (!keyMap[key]) {
                                ok = false;
                                break;
                            }
                        }
                    }
                }

                return ok;
            },

            'have.length' (actual, expected) {
                let len = actual ? actual.length : NaN;
                if (isNaN(len)) {
                    return false;
                }
                return len === expected;
            },

            'lessThan,lt,below' (actual, expected) {
                return actual < expected;
            },

            'lessThanOrEqual,atMost,le,lte' (actual, expected) {
                return actual <= expected;
            },

            'to.match' (actual, expected) {
                return expected.test(String(actual));
            },

            'nan,NaN': {
                fn (actual) {
                    return isNaN(actual);
                },
                explain () {
                    let assertions = this.assertions;

                    assertions.pop(); // remove "nan"
                    assertions.push('NaN');
                }
            },

            'have,only,own|property': {
                fn (object, property, value) {
                    let only = this.modifiers.only;
                    //TODO deep properties "foo.bar.baz"

                    if (this.modifiers.own) {
                        if (!object.hasOwnProperty(property)) {
                            return false;
                        }
                        if (only) {
                            for (let s of Object.keys(object)) {
                                if (s !== property) {
                                    return false;
                                }
                            }
                        }
                    }
                    else if (!(property in object)) {
                        return false;
                    }
                    else if (only) {
                        for (let s in object) {
                            if (s !== property) {
                                return false;
                            }
                        }
                    }

                    if (value !== undefined) {
                        return object[property] === value;
                    }

                    return true;
                },
                explain (object, property, value) {
                    if (value !== undefined) {
                        this.expectation = `${A._print(property)} === ${A._print(value)}`;
                    }
                }
            },

            same: {
                fn (actual, expected) {
                    return A.isEqual(actual, expected, true);
                },
                explain () {
                    let assertions = this.assertions;

                    assertions.pop(); // remove "same"
                    assertions.push('the same as');
                }
            },

            'to.throw' (fn, type) {
                let ok = false;

                try {
                    fn();
                }
                catch (e) {
                    ok = true;

                    let msg = e.message;

                    if (typeof type === 'string') {
                        ok = (msg.indexOf(type) > -1);
                    }
                    else if (type) {
                        ok = type.test(msg);
                    }
                }

                return ok;
            },

            'truthy,ok': {
                fn (actual) {
                    return !!actual;
                },
                explain () {
                    let assertions = this.assertions;
                    let not = this.modifiers.not;

                    assertions.pop(); // remove "truthy"

                    if (not) {
                        assertions.splice(assertions.indexOf('not'), 1);
                    }

                    this.expectation = not ? 'falsy' : 'truthy';
                }
            },

            within (actual, min, max, constraint) {
                let lo, hi;

                if (constraint) {
                    lo = constraint[0];
                    hi = constraint[1];
                }
                else if (typeof min === 'string') {
                    let m = this.constructor.rangeRe.exec(min);
                    lo = m[1];
                    min = parseFloat(m[2]);
                    max = parseFloat(m[3]);
                    hi = m[4];
                }
                else {
                    lo = '[';
                    hi = ']';
                }

                if (lo === '[' ? actual < min : actual <= min) {
                    return false;
                }

                return hi === ']' ? actual <= max : actual < max;
            }
        });
    } // setup

    static wrapAssertion (def) {
        return function (...expected) {
            let me = this;

            me.before(def);
            me.begin(expected);
            me.assertion();
            me.report();

            return me.finish();
        };
    }

    //-----------------------------------------------------------------------
    // Private

    /**
     * This method accepts a modifier (such as `'not'`) and updates the `modifiers`
     * map accordingly. This method will throw an `Error` if modifier cannot be used
     * in the current state.
     * @param {String} modifier
     * @private
     */
    _applyModifier (modifier) {
        let state = this.state;

        this.state = state = state.get(modifier);

        this.modifiers[state.name] = true;
    }

    _getEntry (name, autoCreate) {
        return this.constructor._getEntry(name, autoCreate);
    }

    static _addBit (target, name, canonicalName) {
        if (Object.getOwnPropertyDescriptor(target, name)) {
            throw new Error(`Expectation modifier "${name}" already defined`);
        }

        canonicalName = canonicalName || name;

        Object.defineProperty(target, name, {
            get () {
                this._applyModifier(canonicalName);
                return this;
            }
        });

        return true;
    }

    static _addFn (target, modifier, fn) {
        const A = this;
        const entry = A._getEntry(modifier, false);

        if (Object.getOwnPropertyDescriptor(target, modifier)) {
            throw new Error(`Assertion method "${modifier}" already defined`);
        }

        Object.defineProperty(target, modifier, {
            get () {
                let bound = function (...args) {
                    return fn.apply(bound.instance, args);
                };

                bound.instance = this.instance || this;
                bound._applyModifier = function (m) {
                    bound.instance._applyModifier(m);
                };

                bound.instance._applyModifier(modifier);

                let already = {};
                entry.all.forEach(mod => {
                    A._addModifier(bound, mod, already);
                });

                return bound;
            }
        });
    }

    /**
     * This method adds the necessary property getter to the `target` to track the
     * modifier chain.
     *
     * @param {Object/Function} target The instance to receive the modifier.
     * @param {String} modifier The modifier to track.
     * @param {Object} already The map of modifiers already applied to the `target`.
     * @private
     */
    static _addModifier (target, modifier, already) {
        const A = this;

        if (!already[modifier]) {
            already[modifier] = true;

            // The array of modifiers allowed to follow this one:
            let entry = A._getEntry(modifier, false);

            // Check to see if this modifier is also an assertion method:
            let fn = entry.fn;

            if (fn) {
                A._addFn(target, modifier, fn);
            }
            else {
                A._addBit(target, modifier);

                entry.all.forEach(mod => {
                    A._addModifier(target, mod, already);
                });
            }
        }
    }

    static _getEntry (name, canonicalName, autoCreate) {
        if (typeof canonicalName === 'boolean') {
            autoCreate = canonicalName;
            canonicalName = null;
        }

        let A = this;
        let entries = A.hasOwnProperty('entries') ? A.entries : (A.entries = {});
        let entry = entries[name];

        if (!entry && autoCreate !== false) {
            entries[name] = entry = new A.Modifier(A, name, canonicalName);
        }

        return entry;
    }

    static isArrayLike (v) {
        if (!v || this._notArrayLikeRe.test(typeof v)) {
            return false;
        }

        if (v && v.hasOwnProperty('length') && typeof v.length === 'number') {
            if (v.propertyIsEnumerable && !v.propertyIsEnumerable('length')) {
                // Object has an own, non-enumerable "length" property that is a number
                return true;
            }
        }

        return false;
    }

    static isEqual (o1, o2, strict) {
        if (o1 === o2) {
            return true;
        }
        if (o1 == null || o2 == null) {
            return false; // o1 !== o2 so if either are falsy, we're done
        }

        if (typeof Buffer !== 'undefined' && Buffer.isBuffer(o1) && Buffer.isBuffer(o2)) {
            let n1 = o1.length, n2 = o2.length;

            if (n1 !== n2) {
                return false;
            }

            for (let i = 0; i < n1; ++i) {
                if (o1[i] !== o2[i]) {
                    return false;
                }
            }

            return true;
        }

        let t1 = this.typeOf(o1);
        let t2 = this.typeOf(o2);

        if (t1 === t2) {
            if (t1 === 'date') {
                return +o1 === +o2;
            }
            if (t1 === 'regexp') {
                return String(o1) === String(o2);
            }
        }

        if (typeof o1 !== 'object') {
            if (strict || typeof o2 === 'object') {
                return false;
            }
            return o1 == o2;
        }

        // Object.keys(arguments) is not a great plan... so treat those as arrays
        if (t1 === 'arguments') {
            o1 = arraySlice.call(o1);
        }
        if (t2 === 'arguments') {
            o2 = arraySlice.call(o2);
        }

        // Two objects are equivalent if:
        //  - They have the same __proto__
        //  - They have the same keys()
        //  - The two values for each key isEqual()

        if (Object.getPrototypeOf(o1) !== Object.getPrototypeOf(o2)) {
            return false;
        }

        let keys1 = Object.keys(o1);
        let keys2 = Object.keys(o2);
        let i, k, n = keys1.length;

        if (n !== keys2.length) {
            return false;
        }

        keys1.sort();
        keys2.sort();

        for (i = 0; i < n; ++i) {
            if (keys1[i] !== keys2[i]) {
                return false;
            }
        }

        for (i = 0; i < n; ++i) {
            k = keys1[i];
            if (!this.isEqual(o1[k], o2[k], strict)) {
                return false;
            }
        }

        return true;
    }

    static _isPromise (...obj) {
        for (let o of obj) {
            if (o && this.promiseTypesRe.test(typeof o) && typeof o.then === 'function') {
                return true;
            }
        }

        return false;
    }

    static _print (obj) {
        let t = this.typeOf(obj);

        if (t === 'arguments') {
            obj = arraySlice.call(obj);
        }
        else if (t === 'function') {
            return obj.$className || obj.name || 'anonymous-function';
        }
        else if (t === 'date') {
            return obj.toISOString();
        }
        else if (t === 'error') {
            if (obj.message) {
                return `${obj.name}(${this._print(obj.message)})`;
            }
            return `${obj.name}`;
        }
        else if (t === 'regexp') {
            return String(obj);
        }
        else if (t === 'number') {
            if (isNaN(obj)) {
                return 'NaN';
            }
            if (!isFinite(obj)) {
                return obj < 0 ? '-∞' : '∞';
            }
            if (!obj && 1 / obj < 0) {
                // 0 and -0 are different things... sadly 0 === -0 but we can
                // tell them apart by dropping them in a denominator since 0
                // produces Infinity and -0 produces -Infinity
                return '-0';
            }
        }

        return JSON.stringify(obj);
    }

    static typeOf (v) {
        if (v === null) {
            return 'null';
        }

        let t = typeof v;

        if (!useTypeOfRe.test(t)) {
            let s = toString.call(v);

            if (!(t = toStringMap[s])) {
                let m = toStringRe.exec(s);

                toStringMap[s] = t = m ? m[1].toLowerCase() : s;
            }
        }

        return t;
    }
} // Assert

Assert._notArrayLikeRe = /function|string/;
Assert.promiseTypesRe = /function|object/;
Assert.rangeRe = /^\s*([\[(])\s*(\d+),\s*(\d+)\s*([\])])\s*$/;
Assert.tupleRe = /[\.|\/]/;

Assert.Modifier = class {
    constructor (owner, name, canonicalName) {
        this.all = [];
        this.map = {};
        this.name = name;
        this.owner = owner;
        this.canonicalName = canonicalName || name;

        this.alias = this.canonicalName !== name;
    }

    add (name) {
        if (!name) {
            return;
        }

        let map = this.map;
        let all = this.all;
        let names = (typeof name === 'string') ? [name] : name;

        for (let s of names) {
            if (!map[s]) {
                map[s] = true;
                all.push(s);
            }
        }
    }

    get (name) {
        if (!this.map[name]) {
            let msg = `Expectation cannot use "${name}" `;

            if (this.name === '$') {
                msg += 'immediately';
            } else {
                msg += `after "${this.name}"`;
            }

            throw new Error(msg);
        }

        return this.owner.entries[name];
    }
};

Assert.Promise = (typeof Promise !== 'undefined') && Promise.resolve && Promise;

Object.assign(Assert.prototype, {
    async: null
});

module.exports = Assert;
