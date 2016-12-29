'use strict';

const isNode = typeof window === 'undefined';
const inspect = require(isNode ? 'util' : './inspect').inspect;
const arraySlice = Array.prototype.slice;
const toString = Object.prototype.toString;

function Empty () {}
Empty.prototype = Object.create(null);

/**
 * @class Assert
 */
class Assert {
    static expect (value) {
        let A = this || Assert; // use "this" to allow for derived class
        return new A(value);
    }

    constructor (value, previous, options) {
        let me = this;
        let A = me.constructor;

        me.assertions = [];
        me.value = value;

        me._modifiers = new Empty();

        if (previous) {
            me._previous = previous;

            if (options) {
                if (options.description) {
                    me._explanationPrefix += ' ' + options.description;
                }
            }
        }

        if (!A.hasOwnProperty('registry')) {
            A.setup();
        }
    }

    assertion () {
        let me = this;
        let expected = me.expected;

        if (expected) {
            try {
                let result = !me._word.evaluate.call(me, me.value, ...expected);

                me.failed = me._modifiers.not ? !result : result;
            }
            catch (e) {
                me.failed = e;
            }
        }
    }

    before (word) {
        this._word = word;
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
        let fn = me._word.explain;
        let exp = me.expected;
        let n = exp.length;

        const A = me.constructor;

        me.actual = A.print(me.value);
        me.expectation = me.expectation || (n ? A.print(n === 1 ? exp[0] : exp) : '');

        let ret = fn && fn.call(me, me.value, ...exp);

        if (!ret) {
            ret = `${me._explanationPrefix} ${me.actual} ${me.assertions.join(' ')}`;

            if (me.expectation) {
                ret += ' ' + me.expectation;
            }
        }

        return ret;
    }

    finish () {
        return new this.constructor._Conjunction(this);
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
            to: true,
            not: true,
            only: true,
            have: true,
            own: true,

            'a,an': {
                evaluate (actual, expected) {
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
                        this.expectation = type; // removes the quotes on "type"
                    }
                }
            },

            'approx,approximately': {
                evaluate (actual, expected, epsilon) {
                    epsilon = epsilon || 0.001;

                    A.expect(actual).to.be.a('number');
                    A.expect(expected).to.be.a('number');
                    A.expect(epsilon).to.be.a('number').and.to.be.gt(0);

                    let delta = Math.abs(actual - expected);
                    return delta <= epsilon;
                },
                explain (actual, expected, epsilon) {
                    epsilon = epsilon || 0.001;

                    this.assertions.pop(); // remove "approx"
                    this.expectation = `${A.print(expected)} ± ${A.print(epsilon)}`;
                }
            },

            be (actual, expected) {
                return actual === expected;
            },

            contain (actual, expected, at) {
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

            equal (actual, expected) {
                if (this._modifiers.flatly && expected && typeof expected === 'object') {
                    this.expected[0] = expected = Util.copy({}, expected);
                }
                return Util.isEqual(actual, expected, false);
            },

            falsy (actual) {
                return !actual;
            },

            flatly: {
                get (value) {
                    if (value && typeof value === 'object') {
                        this.value = Util.copy({}, value);
                    }
                }
            },

            get: {
                invoke (value, name) {
                    return new A(value && value[name]);
                }
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

            'key,keys' (actual, ...expected) {
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

            length: {
                evaluate (actual, expected) {
                    let len = actual ? actual.length : NaN;
                    return len === expected;
                },
                get () {
                    let v = this.value;
                    this.value = v ? v.length : NaN;
                }
            },

            'lessThan,lt,below' (actual, expected) {
                return actual < expected;
            },

            'lessThanOrEqual,atMost,le,lte' (actual, expected) {
                return actual <= expected;
            },

            match (actual, expected) {
                return expected.test(String(actual));
            },

            'NaN,nan': {
                evaluate (actual) {
                    return isNaN(actual);
                },
                explain () {
                    let assertions = this.assertions;

                    assertions.pop(); // remove "nan"
                    assertions.push('NaN');
                }
            },

            property: {
                evaluate (object, property, value) {
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
                evaluate (actual, expected) {
                    if (this._modifiers.flatly && expected && typeof expected === 'object') {
                        this.expected[0] = expected = Util.copy({}, expected);
                    }
                    return Util.isEqual(actual, expected, true);
                },
                explain () {
                    let assertions = this.assertions;

                    assertions.pop(); // remove "same"
                    assertions.push('the same as');
                }
            },

            throw: {
                evaluate (fn, type) {
                    let msg, ok = false;

                    try {
                        fn();
                    }
                    catch (e) {
                        ok = true;
                        msg = e.message;

                        if (type) {
                            if (typeof type === 'string') {
                                ok = (msg.indexOf(type) > -1);
                            }
                            else if (type === Error ||
                                     Error.prototype.isPrototypeOf(type.prototype)) {
                                ok = e instanceof type;
                            }
                            else {
                                ok = type.test(msg);
                            }
                        }

                        e.matched = ok;
                        this._threw = e;
                    }

                    return ok;
                },

                explain (fn, type) {
                    if (this.failed) {
                        let not = this._modifiers.not;
                        let e = this._threw;
                        let s = this.expectation;

                        s = s ? s + ' ' : '';

                        if (!e) {
                            // expect(f).to.throw('X')
                            //  ==> Expected f to throw X and it did not throw
                            s += `but it did not throw`;
                        }
                        else if (type && e.matched) {
                            // expect(f).not.to.throw('X')
                            //  ==> Expected f not to throw X but it did
                            // expect(f).not.to.throw();
                            //  ==> Expected f not to throw but it did
                            s += `but it did`;
                        }
                        else {
                            // expect(f).to.throw('X')
                            //  ==> Expected f to throw X but threw Y
                            s += `but it threw ${A.print(e.message)}`;
                        }

                        this.expectation = s;
                    }
                }
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
        let ret = new Empty();

        for (let name of Object.keys(registry)) {
            let def = registry[name];

            if (def === true) {
                def = {};
            }
            else if (typeof def === 'function') {
                def = {
                    evaluate: def
                };
            }

            let names = name.split(',');
            name = names.shift();

            if (def.alias) {
                names = names.concat(def.alias); // handle String or String[]
            }

            ret[name] = {
                name: name,
                alias: names,
                evaluate: def.evaluate || null,
                explain: def.explain || null,
                get: def.get || null,
                invoke: def.invoke || null,
                next: def.next || null
            };
        }

        return ret;
    }

    static register (...args) {
        const A = this;

        for (let registry of args) {
            if (typeof registry === 'function') {
                registry.call(A, A, Util);
                continue;
            }

            registry = A.normalize(registry);

            for (let name of Object.keys(registry)) {
                let def = registry[name];
                let word = A._getWord(name, def);

                word.update(def);
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
        throw new Error(msg);
    }

    static setup () {
        let registry = this.getDefaults();

        this.register(registry);
    }

    //-----------------------------------------------------------------------
    // Private

    /**
     * This method accepts a modifier (such as `'not'`) and updates the `_modifiers`
     * map accordingly. This method will throw an `Error` if modifier cannot be used
     * in the current state.
     * @param {String} modifier
     * @param {Boolean} [track=true]
     * @private
     */
    _applyModifier (modifier, track) {
        let state = this._state = this.constructor.registry[modifier];

        if (track !== false) {
            let modifiers = this._modifiers;
            let name = state.name;

            if (!modifiers[name]) {
                modifiers[name] = true;
                this.assertions.push(modifier);
            }
        }
    }

    _doAssert (word, expected) {
        let me = this;

        me.before(word);
        me.begin(expected);
        me.assertion();
        me.report();

        return me.finish();
    }

    _doInvoke (word, expected) {
        return word.invoke.call(this, this.value, ...expected);
    }

    static _getWord (name, def) {
        let A = this;

        if (!A.hasOwnProperty('registry')) {
            A.registry = new Empty();
            A.forbidden = {};
            A._Conjunction = class extends A.Conjunction {};

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

        let word = A.registry[name];

        if (!word && def) {
            if (A.forbidden[name]) {
                throw new Error(`Cannot redefine "${name}"`);
            }

            word = new A.Word(A, name, def);
        }

        return word;
    }
} // Assert

Assert.Conjunction = class {
    constructor (assertion) {
        this._assertion = assertion;

        let async = assertion._async;

        if (async) {
            this.then = async.then.bind(async);
        }
    }

    get and () {
        const a = this._assertion;
        const A = a.constructor;

        return new A(a.value, a);
    }
};

Assert.Word = class {
    constructor (A, name, def) {
        let me = this;

        me.owner = A;
        me.name = name;
        me.track = def.invoke ? !!def.track : (def.track !== false);

        me.define(name);
        me.defineConjunction(name);
    }

    define (name, target) {
        if (!Util.validNameRe.test(name)) {
            throw new Error(`Cannot register invalid name "${name}"`);
        }

        const word = this;
        const A = word.owner;

        if (!target) {
            target = A.prototype;
            A.registry[name] = word;
        }

        Object.defineProperty(target, name, {
            get () {
                let me = this;
                let assertion = me.$me || me;
                let from = me.$word;
                let get = from && from.get;

                if (get) {
                    assertion = get.call(assertion, assertion.value) || assertion;
                }

                if (word.evaluate || word.invoke) {
                    let bound = function (...args) {
                        if (word.evaluate) {
                            return assertion._doAssert(word, args);
                        }

                        return assertion._doInvoke(word, args);
                    };

                    bound.$me = assertion;
                    bound.$word = word;

                    assertion._applyModifier(name, word.track);

                    for (let mod in A.registry) {
                        let w = A.registry[mod];

                        // We can skip this word and its aliases...
                        if (w !== word) {
                            w.define(mod, bound);
                        }
                    }

                    return bound;
                }

                // just a modifier...

                get = word.get;

                if (get) {
                    let v = get.call(assertion, assertion.value);

                    if (v) {
                        return v;
                    }
                }

                assertion._applyModifier(name, word.track);
                return me;
            }
        });
    }

    defineConjunction (name) {
        const word = this;
        const A = word.owner;
        const C = A._Conjunction;
        const next = word.next;

        if (next) {
            if (next.length > 1) {
                C.prototype[name] = function (...args) {
                    let me = this._assertion; // "this" is the Conjunction

                    return word.next.call(me, me.value, ...args);
                };
            }
            else {
                Object.defineProperty(C.prototype, name, {
                    get () {
                        let me = this._assertion; // "this" is the Conjunction

                        return word.next.call(me, me.value);
                    }
                });
            }
        }
    }

    set (def, name) {
        let value = def[name];
        let ret = false;

        if (value) {
            let me = this;
            let was = me[name];

            if (was && was !== value) {
                value._super = was;
            }

            me[name] = value;
            ret = !was;
        }

        return ret;
    }

    update (def) {
        let me = this;

        if ((def.invoke || me.invoke) && (def.evaluate || me.evaluate)) {
            throw new Error(`Cannot provide both evaluate and invoke functions`);
        }

        me.set(def, 'evaluate');
        me.set(def, 'explain');
        me.set(def, 'get');
        me.set(def, 'invoke');

        if (me.set(def, 'next')) {
            me.defineConjunction(me.name);
        }

        if ('track' in def) {
            me.track = def.track;
        }

        for (let s of def.alias) {
            me.define(s);
            me.defineConjunction(s);
        }
    }
};

Assert.Promise = (typeof Promise !== 'undefined') && Promise.resolve && Promise;

// This prevents shape changes but also is used to generate the list of forbidden
// names:
Object.assign(Assert.prototype, {
    _async: null,
    _explanationPrefix: 'Expected',
    _previous: null,
    _word: null,

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

    copy (dest, ...sources) {
        if (dest) {
            for (let src of sources) {
                if (src) {
                    for (let key in src) {
                        dest[key] = src[key];
                    }
                }
            }
        }

        return dest;
    },

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
        cache: new Empty(),
        toStringRe: /^\[object ([^\]]+)]$/,
        useTypeOfRe: /booolean|number|string|undefined/
    }
};

module.exports = Assert;
