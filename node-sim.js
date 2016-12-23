'use strict';

exports.util = {
    customInspectSymbol: new Symbol('inspector'),

    isError (e) {
        return e instanceof Error;
    }
};

exports.binding = {
    getProxyDetails (obj) {
        //
    },

    isArrayBuffer (obj) {
        //
    },

    isDataView (obj) {
        //
    },

    isDate (obj) {
        //
    },

    isMap (obj) {
        //
    },

    isMapIterator (obj) {
        //
    },

    isPromise (obj) {
        //
    },

    isRegExp (obj) {
        //
    },

    isSet (obj) {
        //
    },

    isSetIterator (obj) {
        //
    },

    isSharedArrayBuffer (obj) {
        //
    },

    isTypedArray (obj) {
        //
    }
};
