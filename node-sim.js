'use strict';

const promiseTypeRe = /^(?:function|object)$/;

const toString = Object.prototype.toString;

function is (obj, T, type) {
    if (!obj) {
        return false;
    }
    if (obj instanceof T) {
        return true;
    }

    let t = toString.call(obj);
    return t === type;
}

module.exports = {
    // internal/util

    customInspectSymbol: Symbol('inspector'),

    isError (obj) {
        return is(obj, Error, '[object Error]');
    },

    // process.binding('util') -- These are implemented in C++ in Node.js so "best"
    // effort

    getProxyDetails (obj) {
        // Probably no good way to know if an object is a Proxy... TODO?
    },

    isArrayBuffer (obj) {
        //TODO
    },

    isDataView (obj) {
        //TODO
    },

    isDate (obj) {
        return is(obj, Date, '[object Date]');
    },

    isMap (obj) {
        return is(obj, Map, '[object Map]');
    },

    isMapIterator (obj) {
        //TODO
    },

    isPromise (o) {
        if (o && promiseTypeRe.test(typeof o) && typeof o.then === 'function') {
            return true;
        }
        return false;
    },

    isRegExp (obj) {
        return is(obj, RegExp, '[object RegExp]');
    },

    isSet (obj) {
        return is(obj, Set, '[object Set]');
    },

    isSetIterator (obj) {
        //TODO
    },

    isSharedArrayBuffer (obj) {
        //TODO
    },

    isTypedArray (obj) {
        //TODO
    }
};
