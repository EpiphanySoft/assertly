'use strict';

const isNode = typeof window === 'undefined';
const inspect = require(isNode ? 'util' : './inspect').inspect;
const arraySlice = Array.prototype.slice;
const toString = Object.prototype.toString;

/**
 * @class Assert
 */
class Assert {
    static expect (value) {
        let A = this || Assert; // use "this" to allow for derived class
        return new A(value);
    }

    constructor (value, previous) {
        let me = this;

        me._modifiers = {};
        me.value = value;

        me._previous = previous || null;
        me._state = me._getEntry('$', false);

        if (!me._state) {
            me.constructor.setup();
            me._state = me._getEntry('$');
        }
    }

    assertion () {
        let me = this;
        let expected = me.expected;

        if (expected) {
            let result = !me._def.fn.call(me, me.value, ...expected);

            me.failed = me._modifiers.not ? !result : result;
        }
    }

    before (def) {
        this._def = def;
    }

    begin (expected) {
        let me = this;
        let A = me.constructor;
        let async = me._async;
        let previous = A._current;

        if (previous && !async) {
            me._async = previous._async.then(() => {
                me.begin(expected);
                return me._async; // this is reassigned below
            },
            e => {
                if (A._current === me) {
                    // If this is the end of the line of assertions, clean things up
                    A._current = null;
                }

                throw e;
            });

            // This assert was made after some other async asserts, so get in line...
            A._current = me;
        }
        else if (async || Util.isPromise(me.value) || Util.isPromise(...expected)) {
            me._async = A.Promise.all(expected.concat(me.value)).then(values => {
                me.expected = values;
                me.value = values.pop();

                if (A._current === me) {
                    // If this is the end of the line of assertions, clean things up
                    A._current = null;
                }

                me.assertion();
                me.report();
            },
            e => {
                if (A._current === me) {
                    A._current = null;
                }

                me.failure(e);
                me.report();
            });

            if (!async) {
                // This is the first async assert, so start the line with it...
                A._current = me;
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
        let def = me._def;
        let fn = def.explain;
        let exp = me.expected;
        let n = exp.length;

        const A = me.constructor;

        me.actual = A.print(me.value);
        me.expectation = me.expectation || (n ? A.print(n === 1 ? exp[0] : exp) : '');

        let mods = Object.keys(me._modifiers);

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
        let async = me._async;
        let A = me.constructor;
        let conjunction = {
            and: new A(me.value, me)
        };

        if (async) {
            conjunction.then = async.then.bind(async);
        }

        return conjunction;
    }

    get (name) {
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

    static getDefaults () {
        const A = this;

        return this.normalize({
            not: 'to',
            to:  'not',

            'to.only': ['have', 'own'],
            'to.have': ['own', 'only'],

            'a,an': {
                fn (actual, expected) {
                    let te = Util.typeOf(expected);
                    let re = te === 'regexp';

                    if (!re && te !== 'string') {
                        return actual instanceof expected;
                    }

                    let t = Util.typeOf(actual);

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
                    this.expectation = `${A.print(expected)} ± ${A.print(epsilon)}`;
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

                    if (t === 'string' || Util.isArrayLike(actual)) {
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
                return Util.isEqual(actual, expected);
            },

            'falsy' (actual) {
                return !actual;
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
                let only = this._modifiers.only;
                let own = this._modifiers.own;
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
                    let only = this._modifiers.only;
                    //TODO deep properties "foo.bar.baz"

                    if (this._modifiers.own) {
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
                        this.expectation = `${A.print(property)} === ${A.print(value)}`;
                    }
                }
            },

            same: {
                fn (actual, expected) {
                    return Util.isEqual(actual, expected, true);
                },
                explain () {
                    let assertions = this.assertions;

                    assertions.pop(); // remove "same"
                    assertions.push('the same as');
                }
            },

            'to.throw' (fn, type) {
                let msg, ok = false;

                try {
                    fn();
                }
                catch (e) {
                    ok = true;
                    msg = e.message;

                    if (typeof type === 'string') {
                        ok = (msg.indexOf(type) > -1);
                    }
                    else if (type) {
                        ok = type.test(msg);
                    }
                }

                return ok;
            },

            'truthy,ok' (actual) {
                return !!actual;
            },

            within (actual, min, max, constraint) {
                let lo, hi;

                if (constraint) {
                    lo = constraint[0];
                    hi = constraint[1];
                }
                else if (typeof min === 'string') {
                    let m = Util.rangeRe.exec(min);
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
    } // getDefaults

    static normalize (registry) {
        let ret = {};

        for (let name of Object.keys(registry)) {
            let def = registry[name];
            let t = typeof def;

            if (t === 'function') {
                def = {
                    fn: def
                };
            }
            else if (t === 'string' || Array.isArray(def)) {
                def = {
                    after: def  // to: 'be'   OR   'to.have': ['only', 'own']
                };
            }

            let after  = Util.toArray(def.after);
            let before = Util.toArray(def.before);

            if (Util.tupleRe.test(name)) {
                // 'afters.name,alias.befores'
                let tuples = name.split(Util.tupleRe);
                let b = tuples.shift();
                name = tuples.shift();
                let a = tuples[0];

                a = a && a.split(',');
                b = b && b.split(',');

                after = a ? after.concat(a) : after;
                before  = b ? before.concat(b)  : before;
            }

            if (!before.length) {
                before = [def.fn ? (name === 'be' ? 'to' : 'be') : '$'];
            }
            if (before.indexOf('to') > -1 && before.indexOf('not') < 0) {
                before = ['not'].concat(before);
            }

            let names = name.split(',');
            name = names.shift();

            if (def.alias) {
                names = names.concat(def.alias); // handle String or String[]
            }

            ret[name] = {
                alias: names.length ? names : [],
                after: after,
                before: before,
                explain: def.explain || null,
                fn: def.fn || null,
                name: name
            };
        }

        return ret;
    }

    static register (name, def) {
        const A = this;
        const P = A.prototype;
        const t = typeof name;

        if (t === 'string') {
            name = {
                [name]: def
            };
        }
        else if (t === 'function') {
            name = name.call(A, A, Util);
        }

        const registry = A.normalize(name);

        for (name in registry) {
            def = registry[name];

            let fn = def.fn && A.wrapAssertion(def);
            let names = [name].concat(def.alias);

            for (let s of names) {
                let entry = A._getEntry(s, name);
                entry.add(def.after);

                if (fn) {
                    let was = entry.def;

                    if (was) {
                        def.fn._super = was.fn;
                        if (def.explain) {
                            def.explain._super = was.explain || null;
                        }
                    }

                    entry.def = def;
                    entry.fn = fn;
                    A._addFn(P, s, fn);
                }
                else {
                    A._addBit(P, s, name);
                }

                for (let b of def.before) {
                    entry = A._getEntry(b);
                    entry.add(s);
                }
            }
        }

        let names = Object.keys(A.registry);
        for (let s of names) {
            if (s !== '$' && !Object.getOwnPropertyDescriptor(P, s)) {
                A._addBit(P, s);
            }
        }
    }

    static print (obj, options) {
        let t = Util.typeOf(obj);

        if (t === 'error') {
            if (obj.message) {
                return `${obj.name}(${this.print(obj.message)})`;
            }
            return `${obj.name}`;
        }
        else if (t === 'arguments') {
            obj = arraySlice.call(obj);
        }
        else if (t === 'number') {
            if (isNaN(obj)) {
                return 'NaN';
            }
            if (!isFinite(obj)) {
                return obj < 0 ? '-∞' : '∞';
            }
        }

        return Util.inspect(obj, options);
    }

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
        let registry = this.getDefaults();

        this.register(registry);
    }

    static wrapAssertion (def) {
        let wrap = function (...expected) {
            let me = this;

            me.before(def);
            me.begin(expected);
            me.assertion();
            me.report();

            return me.finish();
        };

        wrap.def = def;

        return wrap;
    }

    //-----------------------------------------------------------------------
    // Private

    /**
     * This method accepts a modifier (such as `'not'`) and updates the `_modifiers`
     * map accordingly. This method will throw an `Error` if modifier cannot be used
     * in the current state.
     * @param {String} modifier
     * @private
     */
    _applyModifier (modifier) {
        let state = this._state;

        this._state = state = state.get(modifier);

        this._modifiers[state.name] = true;
    }

    _getEntry (name, autoCreate) {
        return this.constructor._getEntry(name, autoCreate);
    }

    static _addBit (target, name, canonicalName) {
        if (Object.getOwnPropertyDescriptor(target, name)) {
            throw new Error(`Modifier "${name}" already defined`);
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

        Object.defineProperty(target, modifier, {
            configurable: true,

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
        if (name !== '$' && !Util.validNameRe.test(name)) {
            throw new Error(`Cannot register invalid name "${name}"`);
        }

        let A = this;

        if (!A.hasOwnProperty('registry')) {
            A.registry = {};
            A.forbidden = {};

            let names = [];

            for (let C = A; ; C = Object.getPrototypeOf(C)) {
                names.push(...Object.getOwnPropertyNames(C.prototype));

                if (C === Assert) {
                    break;
                }
            }

            names.sort();
            for (let key of names) {
                if (Util.validNameRe.test(key)) {
                    A.forbidden[key] = true;  // all keys (even inherited ones)
                }
            }
        }

        let registry = A.registry;
        let entry = registry[name];

        if (!entry && autoCreate !== false) {
            if (A.forbidden[name]) {
                throw new Error(`Cannot redefine "${name}"`);
            }

            registry[name] = entry = new A.Modifier(A, name, canonicalName);
        }

        return entry;
    }
} // Assert

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

        return this.owner.registry[name];
    }
};

Assert.Promise = (typeof Promise !== 'undefined') && Promise.resolve && Promise;

// This prevents shape changes but also is used to generate the list of forbidden
// names:
Object.assign(Assert.prototype, {
    _async: null,
    _def: null,

    actual: null,
    assertions: null,
    expectation: null,
    expected: null,
    failed: null,
    value: null
});

const Util = Assert.Util = {
    notArrayLikeRe: /^(?:function|string)$/,

    promiseTypesRe: /^(?:function|object)$/,

    rangeRe: /^\s*([\[(])\s*(\d+),\s*(\d+)\s*([\])])\s*$/,

    tupleRe: /[\.|\/]/,

    validNameRe: /^[a-z][a-z0-9_]*$/i,

    inspect: inspect,

    isArrayLike (v) {
        if (!v || Util.notArrayLikeRe.test(typeof v)) {
            return false;
        }

        if (v && v.hasOwnProperty('length') && typeof v.length === 'number') {
            if (v.propertyIsEnumerable && !v.propertyIsEnumerable('length')) {
                // Object has an own, non-enumerable "length" property that is a number
                return true;
            }
        }

        return false;
    },

    isEqual (o1, o2, strict) {
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

        let t1 = Util.typeOf(o1);
        let t2 = Util.typeOf(o2);

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
            if (!Util.isEqual(o1[k], o2[k], strict)) {
                return false;
            }
        }

        return true;
    },

    isPromise (...obj) {
        for (let o of obj) {
            if (o && Util.promiseTypesRe.test(typeof o) && typeof o.then === 'function') {
                return true;
            }
        }

        return false;
    },

    toArray (value) {
        if (value == null) {
            return [];
        }

        if (!Array.isArray(value)) {
            if (Util.isArrayLike(value)) {
                let ret = [];
                for (let i = value.length; i--; ) {
                    ret[i] = value[i];
                }
                return ret;
            }

            value = [value];
        }

        return value;
    },

    typeOf (v) {
        if (v === null) {
            return 'null';
        }

        let cache = Util._typeOf.cache;
        let t = typeof v;

        if (!Util._typeOf.useTypeOfRe.test(t)) {
            let s = toString.call(v);

            if (!(t = cache[s])) {
                let m = Util._typeOf.toStringRe.exec(s);

                cache[s] = t = m ? m[1].toLowerCase() : s;
            }
        }

        return t;
    },

    _typeOf: {
        cache: {},
        toStringRe: /^\[object ([^\]]+)]$/,
        useTypeOfRe: /booolean|number|string|undefined/
    }
};

module.exports = Assert;
