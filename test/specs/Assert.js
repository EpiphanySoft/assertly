'use strict';

/* global describe, it */

const Assert = require('../../Assert');

describe('isArrayLike', function () {
    const A = Assert;
    const expect = A.expect;

    describe('arrayish', function () {
        it('should report true for an array', function () {
            expect(A.isArrayLike([])).to.be(true);
        });

        it('should report true for an arguments', function () {
            function foo () {
                expect(A.isArrayLike(arguments)).to.be(true);
            }
            foo();
        });

        it('should report true for string objects', function () {
            expect(A.isArrayLike(new String('hello'))).to.be(true);
        });
    });

    describe('not arrays', function () {
        it('should report false for booleans', function () {
            expect(A.isArrayLike(true)).to.be(false);
        });

        it('should report false for boolean objects', function () {
            expect(A.isArrayLike(new Boolean(true))).to.be(false);
        });

        it('should report false for dates', function () {
            expect(A.isArrayLike(new Date())).to.be(false);
        });

        it('should report false for numbers', function () {
            expect(A.isArrayLike(42)).to.be(false);
        });

        it('should report false for number objects', function () {
            expect(A.isArrayLike(new Number(42))).to.be(false);
        });

        it('should report false for regex', function () {
            expect(A.isArrayLike(/foo/)).to.be(false);
        });

        it('should report false for strings', function () {
            expect(A.isArrayLike('hello')).to.be(false);
        });

        it('should report false for functions', function () {
            function fn () {
            }

            expect(A.isArrayLike(fn)).to.be(false);
        });

        it('should report false for strings', function () {
            expect(A.isArrayLike('hello')).to.be(false);
        });
    });
});

function masterSuite (A) {
    const expect = A.expect;

    describe('an', function () {
        const E = new TypeError('Boo');
        const F = function Func() {};

        describe('array', function () {
            const T = 'array';

            it('should match arrays', function () {
                expect([]).to.be.an(T);

                try {
                    expect([]).not.to.be.an(T);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected [] not to be an array`);
                }
            });

            describe('not', function () {
                it('should not match booleans', function () {
                    expect(false).not.to.be.an(T);
                    expect(true).to.not.be.an(T);
                });
                it('should not match dates', function () {
                    expect(new Date()).not.to.be.an(T);
                });
                it('should not match errors', function () {
                    expect(E).not.to.be.a(T);
                });
                it('should not match functions', function () {
                    expect(F).not.to.be.an(T);
                    expect(F).to.not.be.an(T);
                });
                it('should not match objects', function () {
                    expect({}).not.to.be.an(T);
                    expect({}).to.not.be.an(T);
                });
                it('should not match null', function () {
                    expect(null).not.to.be.an(T);
                    expect(null).to.not.be.an(T);
                });
                it('should not match numbers', function () {
                    expect(0).not.to.be.an(T);
                    expect(0).to.not.be.an(T);
                });
                it('should not match regexps', function () {
                    expect(/a/).not.to.be.an(T);
                    expect(/a/).to.not.be.an(T);
                });
                it('should not match strings', function () {
                    expect('a').not.to.be.an(T);
                    expect('').to.not.be.an(T);
                });
                it('should not match undefined', function () {
                    expect(undefined).not.to.be.an(T);
                    expect(undefined).to.not.be.an(T);
                });
            });
        });

        describe('boolean', function () {
            const T = 'boolean';

            it('should match false', function () {
                expect(false).to.be.a(T);

                try {
                    expect(false).not.to.be.a(T);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected false not to be a boolean`);
                }
            });
            it('should match true', function () {
                expect(true).to.be.a(T);
            });

            describe('not', function () {
                it('should not match dates', function () {
                    expect(new Date()).not.to.be.a(T);
                });
                it('should not match errors', function () {
                    expect(E).not.to.be.a(T);
                });
                it('should not match functions', function () {
                    expect(F).not.to.be.a(T);
                    expect(F).to.not.be.a(T);
                });
                it('should not match objects', function () {
                    expect({}).not.to.be.a(T);
                    expect({}).to.not.be.a(T);
                });
                it('should not match null', function () {
                    expect(null).not.to.be.a(T);
                    expect(null).to.not.be.a(T);
                });
                it('should not match numbers', function () {
                    expect(0).not.to.be.a(T);
                    expect(0).to.not.be.a(T);
                });
                it('should not match regexps', function () {
                    expect(/a/).not.to.be.a(T);
                    expect(/a/).to.not.be.a(T);
                });
                it('should not match strings', function () {
                    expect('a').not.to.be.a(T);
                    expect('').to.not.be.a(T);
                });
                it('should not match undefined', function () {
                    expect(undefined).not.to.be.a(T);
                    expect(undefined).to.not.be.a(T);
                });
                it('should not match undefined', function () {
                    expect(undefined).not.to.be.a(T);
                    expect(undefined).to.not.be.a(T);
                });
            });
        });

        describe('date', function () {
            const T = 'date';
            const V = new Date(1454392800000);

            it('should match new Date', function () {
                expect(V).to.be.a(T);

                try {
                    expect(V).not.to.be.a(T);
                }
                catch (e) {
                    // We get a Date like "2016-02-02T06:00:00.000Z" but we don't
                    // care about the TZ parts really, just that it look right.
                    expect(e.message).to.match(/^Expected 2016-02-\d\dT\d\d:\d\d:\d\d[\dZ.]* not to be a date$/);
                }
            });

            describe('not', function () {
                it('should not match booleans', function () {
                    expect(false).not.to.be.a(T);
                    expect(true).to.not.be.a(T);
                });
                it('should not match errors', function () {
                    expect(E).not.to.be.a(T);
                });
                it('should not match functions', function () {
                    expect(F).not.to.be.a(T);
                    expect(F).to.not.be.a(T);
                });
                it('should not match objects', function () {
                    expect({}).not.to.be.a(T);
                    expect({}).to.not.be.a(T);
                });
                it('should not match null', function () {
                    expect(null).not.to.be.a(T);
                    expect(null).to.not.be.a(T);
                });
                it('should not match numbers', function () {
                    expect(0).not.to.be.a(T);
                    expect(0).to.not.be.a(T);
                });
                it('should not match regexps', function () {
                    expect(/a/).not.to.be.a(T);
                    expect(/a/).to.not.be.a(T);
                });
                it('should not match strings', function () {
                    expect('a').not.to.be.a(T);
                    expect('').to.not.be.a(T);
                });
                it('should not match undefined', function () {
                    expect(undefined).not.to.be.a(T);
                    expect(undefined).to.not.be.a(T);
                });
            });
        });

        describe('error', function () {
            const T = 'error';

            it('should match an error', function () {
                expect(E).to.be.an(T);

                try {
                    expect(E).not.to.be.an(T);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected TypeError("Boo") not to be an error`);
                }
            });

            describe('not', function () {
                it('should not match booleans', function () {
                    expect(false).not.to.be.an(T);
                    expect(true).to.not.be.an(T);
                });
                it('should not match dates', function () {
                    expect(new Date()).not.to.be.an(T);
                });
                it('should not match functions', function () {
                    expect(F).not.to.be.an(T);
                    expect(F).to.not.be.an(T);
                });
                it('should not match null', function () {
                    expect(null).not.to.be.an(T);
                    expect(null).to.not.be.an(T);
                });
                it('should not match numbers', function () {
                    expect(0).not.to.be.an(T);
                    expect(0).to.not.be.an(T);
                });
                it('should not match regexps', function () {
                    expect(/a/).not.to.be.an(T);
                    expect(/a/).to.not.be.an(T);
                });
                it('should not match strings', function () {
                    expect('a').not.to.be.an(T);
                    expect('').to.not.be.an(T);
                });
                it('should not match undefined', function () {
                    expect(undefined).not.to.be.an(T);
                    expect(undefined).to.not.be.an(T);
                });
            });
        });

        describe('function', function () {
            const T = 'function';

            it('should match a function', function () {
                expect(F).to.be.a(T);

                try {
                    expect(F).not.to.be.a(T);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected Func not to be a function`);
                }
            });

            describe('not', function () {
                it('should not match booleans', function () {
                    expect(false).not.to.be.a(T);
                    expect(true).to.not.be.a(T);
                });
                it('should not match dates', function () {
                    expect(new Date()).not.to.be.a(T);
                });
                it('should not match errors', function () {
                    expect(E).not.to.be.a(T);
                });
                it('should not match objects', function () {
                    expect({}).not.to.be.a(T);
                    expect({}).to.not.be.a(T);
                });
                it('should not match null', function () {
                    expect(null).not.to.be.a(T);
                    expect(null).to.not.be.a(T);
                });
                it('should not match numbers', function () {
                    expect(0).not.to.be.a(T);
                    expect(0).to.not.be.a(T);
                });
                it('should not match regexps', function () {
                    expect(/a/).not.to.be.a(T);
                    expect(/a/).to.not.be.a(T);
                });
                it('should not match strings', function () {
                    expect('a').not.to.be.a(T);
                    expect('').to.not.be.a(T);
                });
                it('should not match undefined', function () {
                    expect(undefined).not.to.be.a(T);
                    expect(undefined).to.not.be.a(T);
                });
            });
        });

        describe('number', function () {
            const T = 'number';

            it('should match non-zero', function () {
                expect(1).to.be.a(T);

                try {
                    expect(1).not.to.be.a(T);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected 1 not to be a number`);
                }
            });
            it('should match zero', function () {
                expect(0).to.be.a(T);
            });

            describe('not', function () {
                it('should not match booleans', function () {
                    expect(false).not.to.be.a(T);
                    expect(true).to.not.be.a(T);
                });
                it('should not match dates', function () {
                    expect(new Date()).not.to.be.a(T);
                });
                it('should not match errors', function () {
                    expect(E).not.to.be.a(T);
                });
                it('should not match functions', function () {
                    expect(F).not.to.be.a(T);
                    expect(F).to.not.be.a(T);
                });
                it('should not match objects', function () {
                    expect({}).not.to.be.a(T);
                    expect({}).to.not.be.a(T);
                });
                it('should not match null', function () {
                    expect(null).not.to.be.a(T);
                    expect(null).to.not.be.a(T);
                });
                it('should not match regexps', function () {
                    expect(/a/).not.to.be.a(T);
                    expect(/a/).to.not.be.a(T);
                });
                it('should not match strings', function () {
                    expect('a').not.to.be.a(T);
                    expect('').to.not.be.a(T);
                });
                it('should not match undefined', function () {
                    expect(undefined).not.to.be.a(T);
                    expect(undefined).to.not.be.a(T);
                });
            });
        });

        describe('object', function () {
            const T = 'object';

            it('should match plain object', function () {
                expect({}).to.be.an(T);

                try {
                    expect({}).not.to.be.an(T);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {} not to be an object`);
                }
            });

            describe('not', function () {
                it('should not match booleans', function () {
                    expect(false).not.to.be.an(T);
                    expect(true).to.not.be.an(T);
                });
                it('should not match dates', function () {
                    expect(new Date()).not.to.be.an(T);
                });
                it('should not match errors', function () {
                    expect(E).not.to.be.a(T);
                });
                it('should not match functions', function () {
                    expect(F).not.to.be.an(T);
                    expect(F).to.not.be.an(T);
                });
                it('should not match null', function () {
                    expect(null).not.to.be.an(T);
                    expect(null).to.not.be.an(T);
                });
                it('should not match numbers', function () {
                    expect(0).not.to.be.an(T);
                    expect(0).to.not.be.an(T);
                });
                it('should not match regexps', function () {
                    expect(/a/).not.to.be.an(T);
                    expect(/a/).to.not.be.an(T);
                });
                it('should not match strings', function () {
                    expect('a').not.to.be.an(T);
                    expect('').to.not.be.an(T);
                });
                it('should not match undefined', function () {
                    expect(undefined).not.to.be.an(T);
                    expect(undefined).to.not.be.an(T);
                });
            });
        });

        describe('RegExp', function () {
            const T = 'regexp';

            it('should match regex', function () {
                expect(/a/).to.be.a(T);

                try {
                    expect(/a/).not.to.be.a(T);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected /a/ not to be a regexp`);
                }
            });

            describe('not', function () {
                it('should not match booleans', function () {
                    expect(false).not.to.be.a(T);
                    expect(true).to.not.be.a(T);
                });
                it('should not match dates', function () {
                    expect(new Date()).not.to.be.a(T);
                });
                it('should not match errors', function () {
                    expect(E).not.to.be.a(T);
                });
                it('should not match functions', function () {
                    expect(F).not.to.be.a(T);
                    expect(F).to.not.be.a(T);
                });
                it('should not match objects', function () {
                    expect({}).not.to.be.a(T);
                    expect({}).to.not.be.a(T);
                });
                it('should not match null', function () {
                    expect(null).not.to.be.a(T);
                    expect(null).to.not.be.a(T);
                });
                it('should not match numbers', function () {
                    expect(0).not.to.be.a(T);
                    expect(0).to.not.be.a(T);
                });
                it('should not match strings', function () {
                    expect('a').not.to.be.a(T);
                    expect('').to.not.be.a(T);
                });
                it('should not match undefined', function () {
                    expect(undefined).not.to.be.a(T);
                    expect(undefined).to.not.be.a(T);
                });
            });
        });

        describe('string', function () {
            const T = 'string';

            it('should match strings', function () {
                expect('').to.be.a(T);
                expect('a').to.be.a(T);

                try {
                    expect('a').not.to.be.a(T);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected "a" not to be a string`);
                }
            });

            describe('not', function () {
                it('should not match booleans', function () {
                    expect(false).not.to.be.a(T);
                    expect(true).to.not.be.a(T);
                });
                it('should not match dates', function () {
                    expect(new Date()).not.to.be.a(T);
                });
                it('should not match errors', function () {
                    expect(E).not.to.be.a(T);
                });
                it('should not match functions', function () {
                    expect(F).not.to.be.a(T);
                    expect(F).to.not.be.a(T);
                });
                it('should not match objects', function () {
                    expect({}).not.to.be.a(T);
                    expect({}).to.not.be.a(T);
                });
                it('should not match null', function () {
                    expect(null).not.to.be.a(T);
                    expect(null).to.not.be.a(T);
                });
                it('should not match numbers', function () {
                    expect(0).not.to.be.a(T);
                    expect(0).to.not.be.a(T);
                });
                it('should not match regexps', function () {
                    expect(/a/).not.to.be.a(T);
                    expect(/a/).to.not.be.a(T);
                });
                it('should not match undefined', function () {
                    expect(undefined).not.to.be.a(T);
                    expect(undefined).to.not.be.a(T);
                });
            });
        });
    }); //an

    describe('and', function () {
        it('should allow chaining expectations', function () {
            expect(1).to.be.a('number')
                .and.to.be(1)
                .and.to.be.within(0, 2);
        });
    });

    describe('approximately', function () {
        it('should match on exact numbers', function () {
            expect(2).to.be.approximately(2);

            try {
                expect(2).to.not.be.approximately(2);
            }
            catch (e) {
                expect(e.message).to.be(`Expected 2 to not be 2 ± 0.001`);
            }
        });

        it('should match greater but close numbers', function () {
            expect(2.001).to.be.approximately(2);

            try {
                expect(2.001).to.not.be.approximately(2);
            }
            catch (e) {
                expect(e.message).to.be(`Expected 2.001 to not be 2 ± 0.001`);
            }
        });

        it('should match lesser but close numbers', function () {
            expect(1.999).to.be.approximately(2);

            try {
                expect(1.999).to.not.be.approximately(2);
            }
            catch (e) {
                expect(e.message).to.be(`Expected 1.999 to not be 2 ± 0.001`);
            }
        });

        it('should reject more distant greater numbers', function () {
            expect(2.0011).not.to.be.approximately(2);

            try {
                expect(2.0011).to.be.approximately(2);
            }
            catch (e) {
                expect(e.message).to.be(`Expected 2.0011 to be 2 ± 0.001`);
            }
        });

        it('should reject more distant lesser numbers', function () {
            expect(1.9989).not.to.be.approximately(2);

            try {
                expect(1.9989).to.be.approximately(2);
            }
            catch (e) {
                expect(e.message).to.be(`Expected 1.9989 to be 2 ± 0.001`);
            }
        });

        it('should work for negative numbers', function () {
            expect(-2).to.be.approximately(-2);
            expect(-2.0011).not.to.be.approximately(-2);
            expect(-1.999).to.be.approximately(-2);

            try {
                expect(-2).to.not.be.approximately(-2);
            }
            catch (e) {
                expect(e.message).to.be(`Expected -2 to not be -2 ± 0.001`);
            }
        });

        it('should accept explicit epsilon values', function () {
            expect(2.0011).to.be.approximately(2, 0.1);

            try {
                expect(2.0011).to.not.be.approximately(2, 0.1);
            }
            catch (e) {
                expect(e.message).to.be(`Expected 2.0011 to not be 2 ± 0.1`);
            }
        });
    });

    describe('be', function () {
        it('should match on exact numbers', function () {
            expect(2).to.be(2);
        });

        it('should match on exact regexps', function () {
            let re = /a/;
            expect(re).to.be(re);
        });

        it('should match on exact objects', function () {
            let o = {};
            expect(o).to.be(o);
        });

        it('should match on exact strings', function () {
            expect('abc').to.be('abc');
        });

        describe('not', function () {
            it('should not match using conversions', function () {
                expect(2).to.not.be('2');
                expect(2).not.to.be('2');
            });

            it('should not match on equivalence', function () {
                expect({}).to.not.be({});
                expect({}).not.to.be({});
            });
        });
    });

    describe('contain', function () {
        describe('arrays', function () {
            it('should find false', function () {
                expect([1, 2, false]).to.contain(false);
            });
            it('should find true', function () {
                expect([1, true, 3]).to.contain(true);
            });
            it('should find numbers', function () {
                expect([1, 2, 3]).to.contain(2);
            });
            it('should find objects', function () {
                let o = {};
                expect(['a', o, 'c']).to.contain(o);
            });
            it('should find strings', function () {
                expect(['a', 'b', 'c']).to.contain('b');
            });
            it('should find zero', function () {
                expect([1, 2, 0]).to.contain(0);
            });
        });

        describe('strings', function () {
            it('should match exact', function () {
                expect('hello').to.contain('hello');
            });
            it('should find infixes', function () {
                expect('hello').to.contain('el');
            });
            it('should find prefixes', function () {
                expect('hello').to.contain('he');
            });
            it('should find suffixes', function () {
                expect('hello').to.contain('lo');
            });

            it('should fail when not contained', function () {
                try {
                    expect('hello').to.contain('xo');
                } catch (e) {
                    expect(e.message).to.contain(`Expected "hello" to contain "xo"`);
                }
            });
        });

        describe('at', function () {
            describe('arrays', function () {
                it('should find false', function () {
                    expect([1, 2, false]).to.contain(false, 2);
                });
                it('should find true', function () {
                    expect([1, true, 3]).to.contain(true, 1);
                });
                it('should find numbers', function () {
                    expect([1, 2, 3]).to.contain(1, 0);
                });
                it('should find objects', function () {
                    let o = {};
                    expect(['a', o, 'c']).to.contain(o, 1);
                });
                it('should find strings', function () {
                    expect(['a', 'b', 'c']).to.contain('b', 1);
                });
                it('should find zero', function () {
                    expect([1, 2, 0]).to.contain(0, 2);
                });
            });

            describe('strings', function () {
                it('should match exact', function () {
                    expect('hello').to.contain('hello', 0);
                });
                it('should find infixes', function () {
                    expect('hello').to.contain('el', 1);
                });
                it('should find prefixes', function () {
                    expect('hello').to.contain('he', 0);
                });
                it('should find suffixes', function () {
                    expect('hello').to.contain('lo', 3);
                });
            });
        });

        describe('not', function () {
            describe('arrays', function () {
                it('should work for false', function () {
                    expect([1, 2, 0]).not.to.contain(false);
                    expect([1, 2, 0]).to.not.contain(false);
                });
                it('should work for true', function () {
                    expect([1, true, 3]).not.to.contain(false);
                    expect([1, true, 3]).to.not.contain(false);
                });
                it('should work for numbers', function () {
                    expect([1, 2, 3]).not.to.contain(-2);
                    expect([1, 2, 3]).to.not.contain(-2);
                });
                it('should work for objects', function () {
                    let o = {};
                    expect(['a', o, 'c']).not.to.contain({});
                    expect(['a', o, 'c']).to.not.contain({});
                });
                it('should work for strings', function () {
                    expect(['a', 'b', 'c']).not.to.contain('B');
                    expect(['a', 'b', 'c']).to.not.contain('B');
                });
                it('should work for zero', function () {
                    expect([1, 2, false]).not.to.contain(0);
                    expect([1, 2, '']).to.not.contain(0);
                });

                it('should fail when not contained', function () {
                    try {
                        expect([1,2,0]).to.not.contain(0);
                    } catch (e) {
                        expect(e.message).to.contain(`Expected [1,2,0] to not contain 0`);
                    }
                });
            });

            describe('strings', function () {
                it('should work on exact length', function () {
                    expect('hello').not.to.contain('Hello');
                    expect('hello').to.not.contain('Hello');
                });
                it('should work for shorter', function () {
                    expect('hello').not.to.contain('ff');
                    expect('hello').to.not.contain('ef');
                });
                it('should work for longer', function () {
                    expect('hello').not.to.contain('hesfdsfdsfsfd');
                    expect('hello').to.not.contain('hesfdsfdsfsfd');
                });

                it('should fail when not contained', function () {
                    try {
                        expect('hello').to.not.contain('he');
                    } catch (e) {
                        expect(e.message).to.contain(`Expected "hello" to not contain "he"`);
                    }
                });
            });

            describe('at', function () {
                describe('arrays', function () {
                    it('should work for false', function () {
                        expect([1, false]).not.to.contain(false, 2);
                        expect([1]).to.not.contain(false, 2);
                    });
                    it('should work for true', function () {
                        expect([1, 3, true]).not.to.contain(true, 1);
                        expect([1, 3]).to.not.contain(true, 1);
                    });
                    it('should work for numbers', function () {
                        expect([1, 2, 3]).not.to.contain(1, 1);
                        expect([1, 2, 3]).to.not.contain(7, 0);
                    });
                    it('should work for objects', function () {
                        let o = {};
                        expect(['a', o, 'c']).not.to.contain(o, 0);
                        expect(['a', o, 'c']).to.not.contain({}, 1);
                    });
                    it('should work for strings', function () {
                        expect(['a', 'b', 'c']).not.to.contain('b', 0);
                        expect(['a', 'b', 'c']).to.not.contain('x', 2);
                    });
                    it('should work for zero', function () {
                        expect([1, 2, 0]).not.to.contain(0, 1);
                        expect([1, 2, 3]).to.not.contain(0, 2);
                    });
                });

                describe('strings', function () {
                    it('should work exact length', function () {
                        expect('hello').not.to.contain('hello', 1);
                        expect('hello').to.not.contain('hillo', 0);
                    });
                    it('should work for infixes', function () {
                        expect('hello').not.to.contain('el', 2);
                        expect('hello').to.not.contain('xl', 1);
                    });
                    it('should find prefixes', function () {
                        expect('hello').not.to.contain('hx', 0);
                        expect('hello').to.not.contain('he', 1);
                    });
                    it('should find suffixes', function () {
                        expect('hello').not.to.contain('lx', 3);
                        expect('hello').to.not.contain('lo', 1);
                    });
                });
            });
        });
    });

    describe('empty', function () {
        it('should report null as empty', function () {
            expect(null).to.be.empty();

            try {
                expect(null).not.to.be.empty();
            }
            catch (e) {
                expect(e.message).to.be('Expected null not to be empty');
            }
        });

        it('should report undefined as empty', function () {
            expect(undefined).to.be.empty();

            try {
                expect(undefined).to.not.be.empty();
            }
            catch (e) {
                expect(e.message).to.be('Expected undefined to not be empty');
            }
        });

        it('should report numbers as non-empty', function () {
            expect(0).not.to.be.empty();
            expect(0).to.not.be.empty();

            try {
                expect(0).to.be.empty();
            }
            catch (e) {
                expect(e.message).to.be('Expected 0 to be empty');
            }
        });

        it('should report booleans as non-empty', function () {
            expect(false).not.to.be.empty();
            expect(true).to.not.be.empty();

            try {
                expect(false).to.be.empty();
            }
            catch (e) {
                expect(e.message).to.be('Expected false to be empty');
            }
        });

        it('should handle arguments', function () {
            function foo () {
                expect(arguments).to.be.empty();
            }

            foo();

            try {
                let bar = function () {
                    expect(arguments).to.be.empty();
                };

                bar(1);
            }
            catch (e) {
                expect(e.message).to.be(`Expected [1] to be empty`);
            }
        });

        it('should handle arrays', function () {
            expect([]).to.be.empty();

            try {
                expect([0]).to.be.empty();
            }
            catch (e) {
                expect(e.message).to.be(`Expected [0] to be empty`);
            }
        });

        it('should handle strings', function () {
            expect('').to.be.empty();

            try {
                expect('x').not.to.be.empty();
            }
            catch (e) {
                expect(e.message).to.be(`Expected "x" not to be empty`);
            }
        });
    });

    describe('equal', function () {
        it('should handle numbers', function () {
            expect(1).to.equal(1);

            try {
                expect(2).not.to.equal(2);
            }
            catch (e) {
                expect(e.message).to.be('Expected 2 not to equal 2');
            }

            try {
                expect(3).to.not.equal(3);
            }
            catch (e) {
                expect(e.message).to.be('Expected 3 to not equal 3');
            }
        });

        it('should do basic conversion', function () {
            expect(1).to.equal('1');
            expect('2').to.equal(2);
        });

        it('should handle arrays', function () {
            expect([0]).to.equal(['0']);
            expect(['2', 3, 1]).to.equal([2, '3', 1]);
        });

        it('should handle arguments', function () {
            function foo () {
                expect(arguments).to.equal([1, 2]);
                expect([1, 2]).to.equal(arguments);
            }
            foo(1, 2);
        });
    });

    ['above', 'greaterThan', 'gt'].forEach(function (gt) {
        describe(gt, function () {
            it('should match greater numbers', function () {
                expect(3).to.be[gt](2);
            });
            it('should match greater strings', function () {
                expect('b').to.be[gt]('a');
            });

            describe('not', function () {
                it('should not match lesser numbers', function () {
                    expect(3).not.to.be[gt](4);
                    expect(3).to.not.be[gt](4);
                });
                it('should not match greater strings', function () {
                    expect('b').not.to.be[gt]('c');
                    expect('b').to.not.be[gt]('c');
                });
                it('should not match equal numbers', function () {
                    expect(3).not.to.be[gt](3);
                    expect(3).to.not.be[gt](3);
                });
                it('should not match equal strings', function () {
                    expect('a').to.not.be[gt]('a');
                    expect('a').not.to.be[gt]('a');
                });
            });
        });
    });

    ['greaterThanOrEqual', 'gte', 'ge'].forEach(function (ge) {
        describe(ge, function () {
            it('should match greater numbers', function () {
                expect(3).to.be[ge](2);
            });
            it('should match greater strings', function () {
                expect('b').to.be[ge]('a');
            });
            it('should match equal numbers', function () {
                expect(3).to.be[ge](3);
            });
            it('should match equal strings', function () {
                expect('a').to.be[ge]('a');
            });

            describe('not', function () {
                it('should not match lesser numbers', function () {
                    expect(3).not.to.be[ge](4);
                    expect(3).to.not.be[ge](4);
                });
                it('should not match greater strings', function () {
                    expect('b').not.to.be[ge]('c');
                    expect('b').to.not.be[ge]('c');
                });
            });
        });
    });

    describe('in', function () {
        it('should handle arrays', function () {
            expect(42).to.be.in([1, 2, 42]);

            try {
                expect(42).not.to.be.in([1, 2, 42]);
            }
            catch (e) {
                expect(e.message).to.be(`Expected 42 not to be in [1,2,42]`);
            }

            try {
                expect(427).to.not.be.in([1, 427, 42]);
            }
            catch (e) {
                expect(e.message).to.be(`Expected 427 to not be in [1,427,42]`);
            }
        });

        it('should handle strings', function () {
            expect('foo').to.be.in('foobar');
            expect('bar').to.be.in('foobar');
            expect('oba').to.be.in('foobar');

            try {
                expect('oba').not.to.be.in('foobar');
            }
            catch (e) {
                expect(e.message).to.be(`Expected "oba" not to be in "foobar"`);
            }
        });

        it('should not find missing items in arrays', function () {
            expect(0).not.to.be.in([1, 2, 42]);
            expect(false).not.to.be.in([0, 2, 42]);

            try {
                expect(0).to.be.in([1, 2, 42, '']);
            }
            catch (e) {
                expect(e.message).to.be(`Expected 0 to be in [1,2,42,""]`);
            }
        });

        it('should not find missing items in strings', function () {
            expect('x').not.to.be.in('hello');

            try {
                expect('x').to.be.in('hello');
            }
            catch (e) {
                expect(e.message).to.be(`Expected "x" to be in "hello"`);
            }
        });
    });

    describe('keys', function () {
        const a = { a: 1 };
        const a2 = Object.create(a);

        const b = { a: 2, b: 3 };
        const b2 = Object.create(b);
        b2.c = 4;
        const xyz = { x: 2, y: 3, z: 4 };

        describe('any', function () {
            it('should match own properties', function () {
                expect(a).to.have.key('a');

                expect(b).to.have.key('a');
                expect(b).to.have.key('b');
            });

            it('should match inherited properties', function () {
                expect(b2).to.have.key('a');
                expect(b2).to.have.key('b');
                expect(b2).to.have.key('c');
            });

            it('should match multiple own properties', function () {
                expect(b).to.have.keys('a', 'b');
                expect(b).to.have.keys('b', 'a');
            });

            it('should match multiple inherited properties', function () {
                expect(b2).to.have.keys('a', 'b');
                expect(b2).to.have.keys('b', 'a');
            });

            it('should match multiple own and inherited properties', function () {
                expect(b2).to.have.keys('a', 'b', 'c');
            });

            it('should fail on missing one of many properties', function () {
                try {
                    expect(a).to.have.keys('a', 'x');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":1} to have keys ["a","x"]`);
                }
            });

            describe('not', function () {
                it('should fail on present properties', function () {
                    try {
                        expect(a).not.to.have.key('a');
                    }
                    catch (e) {
                        expect(e.message).to.be(`Expected {"a":1} not to have key "a"`);
                    }
                });

                it('should not match missing properties', function () {
                    expect(a).not.to.have.key('b');
                    expect(a).to.not.have.key('b');

                    expect(b).not.to.have.key('c');
                    expect(b).to.not.have.key('c');

                    expect(b2).not.to.have.key('x');
                    expect(b2).to.not.have.key('x');
                });
            });
        }); // any

        describe('only', function () {
            it('should match own properties', function () {
                expect(a).to.only.have.key('a');

                expect(a).to.have.only.key('a');
            });

            it('should match inherited properties', function () {
                expect(a2).to.only.have.key('a');

                expect(a2).to.have.only.key('a');
            });

            it('should fail if missing', function () {
                try {
                    expect(b).to.only.have.key('c');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":2,"b":3} to only have key "c"`);
                }
            });

            it('should fail if not only', function () {
                try {
                    expect(b).to.only.have.key('a');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":2,"b":3} to only have key "a"`);
                }
            });

            it('should fail if not only with multiple keys', function () {
                try {
                    expect(xyz).to.only.have.keys('x', 'y');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"x":2,"y":3,"z":4} to only have keys ["x","y"]`);
                }
            });

            describe('not', function () {
                it('should fail on present properties', function () {
                    try {
                        expect(a).not.to.only.have.key('a');
                    }
                    catch (e) {
                        expect(e.message).to.be(`Expected {"a":1} not to only have key "a"`);
                    }
                });

                it('should not match missing properties', function () {
                    expect(b).not.to.only.have.key('c');
                    expect(b).to.not.only.have.key('c');

                    expect(b).not.to.have.only.key('c');
                    expect(b).to.not.have.only.key('c');
                });
            });
        }); // only

        describe('only own', function () {
            it('should match own properties', function () {
                expect(a).to.only.have.own.key('a');
                expect(a).to.have.only.own.key('a');
            });

            it('should fail if missing', function () {
                try {
                    expect(b).to.only.have.own.key('c');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":2,"b":3} to only have own key "c"`);
                }
            });

            it('should fail if not only', function () {
                try {
                    expect(b).to.only.have.own.key('a');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":2,"b":3} to only have own key "a"`);
                }
            });

            it('should fail if not own', function () {
                try {
                    expect(a2).to.only.have.own.key('a');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {} to only have own key "a"`);
                }
            });

            it('should fail if not all are own with multiple keys', function () {
                try {
                    expect(b2).to.only.have.own.keys('a', 'c');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"c":4} to only have own keys ["a","c"]`);
                }
            });

            describe('not', function () {
                it('should not match inherited properties', function () {
                    expect(a2).not.to.only.have.own.key('a');
                    expect(a2).to.not.only.have.own.key('a');

                    expect(a2).not.to.have.only.own.key('a');
                    expect(a2).to.not.have.only.own.key('a');
                });

                it('should not match missing properties', function () {
                    expect(b).not.to.only.have.own.key('c');
                    expect(b).to.not.only.have.own.key('c');

                    expect(b).not.to.have.only.own.key('c');
                    expect(b).to.not.have.only.own.key('c');
                });

                it('should not match with other properties present', function () {
                    expect(b).not.to.only.have.own.key('a');
                    expect(b).to.not.only.have.own.key('a');

                    expect(b).not.to.have.only.own.key('a');
                    expect(b).to.not.have.only.own.key('a');
                });
            });
        }); // only own

        describe('own', function () {
            it('should match own properties', function () {
                expect(a).to.have.own.key('a');
            });

            it('should not match with other properties present', function () {
                expect(b).to.have.own.key('a');
            });

            it('should fail if missing', function () {
                try {
                    expect(b).to.have.own.key('c');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":2,"b":3} to have own key "c"`);
                }
            });

            it('should fail if not own', function () {
                try {
                    expect(a2).to.have.own.key('a');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {} to have own key "a"`);
                }
            });

            it('should match for some of own with multiple keys', function () {
                try {
                    expect(xyz).not.to.have.own.keys('x', 'y');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"x":2,"y":3,"z":4} not to have own keys ["x","y"]`);
                }
            });

            describe('not', function () {
                it('should not match inherited properties', function () {
                    expect(a2).not.to.have.own.key('a');
                    expect(a2).to.not.have.own.key('a');
                });

                it('should not match missing properties', function () {
                    expect(b).not.to.have.own.key('c');
                    expect(b).to.not.have.own.key('c');
                });
            });
        }); // own
    }); // keys

    describe('length', function () {
        it('should work on arguments', function () {
            function f () {
                expect(arguments).to.have.length(4);
            }
            f(1, 2, 3, 4);
        });
        it('should work on arrays', function () {
            expect([1,2]).to.have.length(2);
        });
        it('should work on strings', function () {
            expect('abc').to.have.length(3);
        });

        describe('not', function () {
            it('should work on arguments', function () {
                function f () {
                    expect(arguments).not.to.have.length(5);
                    expect(arguments).to.not.have.length(5);
                }
                f(1, 2, 3, 4);
            });
            it('should work on arrays', function () {
                expect([1,2]).not.to.have.length(3);
                expect([1,2]).to.not.have.length(3);
            });
            it('should work on strings', function () {
                expect('abc').not.to.have.length(5);
                expect('abc').to.not.have.length(5);
            });
        });
    });

    ['below', 'lessThan', 'lt'].forEach(function (lt) {
        describe(lt, function () {
            it('should match lesser numbers', function () {
                expect(3).to.be[lt](4);
            });
            it('should match lesser strings', function () {
                expect('b').to.be[lt]('c');
            });

            describe('not', function () {
                it('should not match equal numbers', function () {
                    expect(3).not.to.be[lt](3);
                    expect(3).to.not.be[lt](3);
                });
                it('should not match equal strings', function () {
                    expect('a').to.not.be[lt]('a');
                    expect('a').not.to.be[lt]('a');
                });
                it('should not match greater numbers', function () {
                    expect(3).not.to.be[lt](2);
                    expect(3).to.not.be[lt](2);
                });
                it('should not match greater strings', function () {
                    expect('c').to.not.be[lt]('b');
                    expect('c').not.to.be[lt]('b');
                });
            });
        });
    });

    ['lessThanOrEqual', 'lte', 'le'].forEach(function (le) {
        describe(le, function () {
            it('should match lesser numbers', function () {
                expect(3).to.be[le](3);
            });
            it('should match lesser strings', function () {
                expect('b').to.be[le]('b');
            });
            it('should match equal numbers', function () {
                expect(3).to.be[le](3);
            });
            it('should match equal strings', function () {
                expect('a').to.be[le]('a');
            });

            describe('not', function () {
                it('should not match greater numbers', function () {
                    expect(3).not.to.be[le](2);
                    expect(3).to.not.be[le](2);
                });
                it('should not match greater strings', function () {
                    expect('c').to.not.be[le]('b');
                    expect('c').not.to.be[le]('b');
                });
            });
        });
    });

    describe('match', function () {
        it('should identify matches', function () {
            expect('ABC').to.match(/abc/i);
        });

        describe('not', function () {
            it('should identity mismatches', function () {
                expect('xyz').to.not.match(/abc/i);
                expect('xyz').not.to.match(/abc/i);
            });
        });
    });

    describe('nan', function () {
        it('should identify NaN', function () {
            expect(NaN).to.be.nan();

            try {
                expect(NaN).not.to.be.nan();
            }
            catch (e) {
                expect(e.message).to.be('Expected NaN not to be NaN');
            }
        });

        it('should not identify numbers', function () {
            expect(0).not.to.be.nan();

            try {
                expect(0).to.be.nan();
            }
            catch (e) {
                expect(e.message).to.be('Expected 0 to be NaN');
            }
        });
    });

    describe('property', function () {
        const a = { a: 1 };
        const a2 = Object.create(a);

        const b = { a: 2, b: 3 };
        const b2 = Object.create(b);
        b2.c = 4;

        describe('any', function () {
            it('should match own and inherited properties', function () {
                expect(a).to.have.property('a');

                expect(b).to.have.property('a');
                expect(b).to.have.property('b');

                expect(b2).to.have.property('a');
                expect(b2).to.have.property('b');
                expect(b2).to.have.property('c');

                try {
                    expect(a).not.to.have.property('a');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":1} not to have property "a"`);
                }

                try {
                    expect(a).to.not.have.property('a');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":1} to not have property "a"`);
                }
            });

            describe('with a value', function () {
                it('should match own properties', function () {
                    expect(a).to.have.property('a', 1);

                    expect(b).to.have.property('a', 2);
                    expect(b).to.have.property('b', 3);

                    expect(b2).to.have.property('c', 4);

                    try {
                        expect(a).not.to.have.property('a', 1);
                    }
                    catch (e) {
                        expect(e.message).to.be(`Expected {"a":1} not to have property "a" === 1`);
                    }

                    try {
                        expect(a).to.not.have.property('a', 1);
                    }
                    catch (e) {
                        expect(e.message).to.be(`Expected {"a":1} to not have property "a" === 1`);
                    }
                });

                it('should match inherited properties', function () {
                    expect(a2).to.have.property('a', 1);

                    expect(b2).to.have.property('a', 2);
                    expect(b2).to.have.property('b', 3);
                });
            });

            describe('not', function () {
                it('should fail on present properties', function () {
                    try {
                        expect(a).not.to.have.property('a');
                    }
                    catch (e) {
                        expect(e.message).to.be(`Expected {"a":1} not to have property "a"`);
                    }
                });

                it('should not match missing properties', function () {
                    expect(a).not.to.have.property('b');
                    expect(a).to.not.have.property('b');

                    expect(b).not.to.have.property('c');
                    expect(b).to.not.have.property('c');

                    expect(b2).not.to.have.property('x');
                    expect(b2).to.not.have.property('x');
                });

                describe('with a value', function () {
                    it('should not match properties with unequal value', function () {
                        expect(a).not.to.have.property('a', 2);
                        expect(a).to.not.have.property('a', 2);

                        expect(b).not.to.have.property('a', 3);
                        expect(b).to.not.have.property('b', 4);

                        expect(b2).not.to.have.property('a', 5);
                        expect(b2).to.not.have.property('b', 6);
                    });
                });
            });
        }); // any

        describe('only', function () {
            it('should match own properties', function () {
                expect(a).to.only.have.property('a');

                expect(a).to.have.only.property('a');
            });

            it('should match inherited properties', function () {
                expect(a2).to.only.have.property('a');

                expect(a2).to.have.only.property('a');
            });

            describe('with a value', function () {
                it('should match own properties', function () {
                    expect(a).to.only.have.property('a', 1);
                    expect(a).to.have.only.property('a', 1);
                });
                it('should match inherited properties', function () {
                    expect(a2).to.only.have.property('a', 1);
                    expect(a2).to.have.only.property('a', 1);
                });
            });

            it('should fail if missing', function () {
                try {
                    expect(b).to.only.have.property('c');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":2,"b":3} to only have property "c"`);
                }
            });

            it('should fail if not only', function () {
                try {
                    expect(b).to.only.have.property('a');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":2,"b":3} to only have property "a"`);
                }
            });

            describe('not', function () {
                it('should fail on present properties', function () {
                    try {
                        expect(a).not.to.only.have.property('a');
                    }
                    catch (e) {
                        expect(e.message).to.be(`Expected {"a":1} not to only have property "a"`);
                    }
                });

                it('should not match missing properties', function () {
                    expect(b).not.to.only.have.property('c');
                    expect(b).to.not.only.have.property('c');

                    expect(b).not.to.have.only.property('c');
                    expect(b).to.not.have.only.property('c');
                });

                describe('with a value', function () {
                    it('should not match properties with unequal value', function () {
                        expect(a).not.to.only.have.property('a', 2);
                        expect(a).to.not.only.have.property('a', 2);

                        expect(a).not.to.have.only.property('a', 2);
                        expect(a).to.not.have.only.property('a', 2);
                    });

                    it('should not match missing properties', function () {
                        expect(b).not.to.only.have.property('c', 2);
                        expect(b).to.not.only.have.property('c', 2);

                        expect(b).not.to.have.only.property('c', 2);
                        expect(b).to.not.have.only.property('c', 2);
                    });

                    it('should not match with other properties present', function () {
                        expect(b).not.to.only.have.property('a', 1);
                        expect(b).to.not.only.have.property('a', 1);

                        expect(b).not.to.have.only.property('a', 1);
                        expect(b).to.not.have.only.property('a', 1);
                    });
                });
            });
        }); // only

        describe('only own', function () {
            it('should match own properties', function () {
                expect(a).to.only.have.own.property('a');
                expect(a).to.have.only.own.property('a');
            });

            describe('with a value', function () {
                it('should match own properties', function () {
                    expect(a).to.only.have.own.property('a', 1);
                    expect(a).to.have.only.own.property('a', 1);
                });
            });

            it('should fail if missing', function () {
                try {
                    expect(b).to.only.have.own.property('c');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":2,"b":3} to only have own property "c"`);
                }
            });

            it('should fail if not only', function () {
                try {
                    expect(b).to.only.have.own.property('a');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":2,"b":3} to only have own property "a"`);
                }
            });

            it('should fail if not own', function () {
                try {
                    expect(a2).to.only.have.own.property('a');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {} to only have own property "a"`);
                }
            });

            describe('not', function () {
                it('should not match inherited properties', function () {
                    expect(a2).not.to.only.have.own.property('a');
                    expect(a2).to.not.only.have.own.property('a');

                    expect(a2).not.to.have.only.own.property('a');
                    expect(a2).to.not.have.only.own.property('a');
                });

                it('should not match missing properties', function () {
                    expect(b).not.to.only.have.own.property('c');
                    expect(b).to.not.only.have.own.property('c');

                    expect(b).not.to.have.only.own.property('c');
                    expect(b).to.not.have.only.own.property('c');
                });

                it('should not match with other properties present', function () {
                    expect(b).not.to.only.have.own.property('a');
                    expect(b).to.not.only.have.own.property('a');

                    expect(b).not.to.have.only.own.property('a');
                    expect(b).to.not.have.only.own.property('a');
                });

                describe('with a value', function () {
                    it('should not match inherited properties', function () {
                        expect(a2).not.to.only.have.own.property('a', 1);
                        expect(a2).to.not.only.have.own.property('a', 1);

                        expect(a2).not.to.have.only.own.property('a', 1);
                        expect(a2).to.not.have.only.own.property('a', 1);
                    });

                    it('should not match properties with unequal value', function () {
                        expect(a).not.to.only.have.own.property('a', 2);
                        expect(a).to.not.only.have.own.property('a', 2);

                        expect(a).not.to.have.only.own.property('a', 2);
                        expect(a).to.not.have.only.own.property('a', 2);
                    });

                    it('should not match missing properties', function () {
                        expect(b).not.to.only.have.own.property('c', 2);
                        expect(b).to.not.only.have.own.property('c', 2);

                        expect(b).not.to.have.only.own.property('c', 2);
                        expect(b).to.not.have.only.own.property('c', 2);
                    });

                    it('should not match with other properties present', function () {
                        expect(b).not.to.only.have.own.property('a', 1);
                        expect(b).to.not.only.have.own.property('a', 1);

                        expect(b).not.to.have.only.own.property('a', 1);
                        expect(b).to.not.have.only.own.property('a', 1);
                    });
                });
            });
        }); // only own

        describe('own', function () {
            it('should match own properties', function () {
                expect(a).to.have.own.property('a');
            });

            it('should not match with other properties present', function () {
                expect(b).to.have.own.property('a');
            });

            describe('with a value', function () {
                it('should match own properties', function () {
                    expect(a).to.have.own.property('a', 1);
                });

                it('should match with other properties present', function () {
                    expect(b).to.have.own.property('a', 2);
                });
            });

            it('should fail if missing', function () {
                try {
                    expect(b).to.have.own.property('c');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {"a":2,"b":3} to have own property "c"`);
                }
            });

            it('should fail if not own', function () {
                try {
                    expect(a2).to.have.own.property('a');
                }
                catch (e) {
                    expect(e.message).to.be(`Expected {} to have own property "a"`);
                }
            });

            describe('not', function () {
                it('should not match inherited properties', function () {
                    expect(a2).not.to.have.own.property('a');
                    expect(a2).to.not.have.own.property('a');
                });

                it('should not match missing properties', function () {
                    expect(b).not.to.have.own.property('c');
                    expect(b).to.not.have.own.property('c');
                });

                describe('with a value', function () {
                    it('should not match inherited properties', function () {
                        expect(a2).not.to.have.own.property('a', 1);
                        expect(a2).to.not.have.own.property('a', 1);
                    });

                    it('should not match properties with unequal value', function () {
                        expect(a).not.to.have.own.property('a', 2);
                        expect(a).to.not.have.own.property('a', 2);
                    });

                    it('should not match missing properties', function () {
                        expect(b).not.to.have.own.property('c', 2);
                        expect(b).to.not.have.own.property('c', 2);
                    });
                });
            });
        }); // own
    }); // property

    describe('same', function () {
        it('should handle numbers', function () {
            expect(1).to.be.same(1);

            try {
                expect(2).not.to.be.same(2);
            }
            catch (e) {
                expect(e.message).to.be('Expected 2 not to be the same as 2');
            }

            try {
                expect(3).to.not.be.same(3);
            }
            catch (e) {
                expect(e.message).to.be('Expected 3 to not be the same as 3');
            }
        });

        it('should not do conversion', function () {
            expect(1).to.not.be.same('1');
            expect('2').not.to.be.same(2);
        });

        it('should handle arrays', function () {
            expect([0]).to.be.same([0]);
            expect([2, 3, 1]).to.be.same([2, 3, 1]);

            expect(['2', 3, 1]).to.not.be.same([2, '3', 1]);

            try {
                expect([2, 3, 1]).not.to.be.same([2, 3, 1]);
            }
            catch (e) {
                expect(e.message).to.be('Expected [2,3,1] not to be the same as [2,3,1]');
            }
        });

        it('should handle arguments', function () {
            function foo () {
                expect(arguments).to.be.same([1, 2]);
                expect([1, 2]).to.be.same(arguments);
            }
            foo(1, 2);
        });
    });

    describe('throw', function () {
        it('should basically work', function () {
            expect(function () {
                throw new Error('Foo');
            }).to.throw();
        });

        it('should succeed if function does not throw', function () {
            expect(function () {}).not.to.throw();
            expect(function () {}).to.not.throw();
        });

        it('should match exception message as a string', function () {
            expect(function () {
                throw new Error('Foo');
            }).to.throw('Foo');
        });

        it('should match exception message as a regex', function () {
            expect(function () {
                throw new Error('Foo');
            }).to.throw(/foo/i);
        });

        it('should match exception message as a regex', function () {
            expect(function () {
                throw new Error('Foo');
            }).to.throw(/foo/i);
        });

        it('should fail if function does not throw', function () {
            try {
                expect(function foobar () {}).to.throw();
            }
            catch (e) {
                expect(e.message).to.contain('Expected foobar to throw');
            }
        });

        describe('not', function () {
            it('should fail on mismatch exception message as a string', function () {
                try {
                    expect(function fizzo () {
                        throw new Error('Bar');
                    }).to.throw('Foo');
                }
                catch (e) {
                    expect(e.message).to.contain(`Expected fizzo to throw "Foo"`);
                }
            });

            it('should fail on mismatch exception message as a regex', function () {
                try {
                    expect(function bizzo () {
                        throw new Error('Bar');
                    }).to.throw(/foo/i);
                }
                catch (e) {
                    expect(e.message).to.contain('Expected bizzo to throw /foo/i');
                }
            });

            it('should fail if function throws but expected to not', function () {
                try {
                    expect(function foobar () {
                        throw new Error('foobar!!');
                    }).to.not.throw();
                }
                catch (e) {
                    expect(e.message).to.contain('Expected foobar to not throw');
                }
            });

            it('should fail if function throws but expected not to', function () {
                try {
                    expect(function foobar () {
                        throw new Error('foobar!!');
                    }).not.to.throw();
                }
                catch (e) {
                    expect(e.message).to.contain('Expected foobar not to throw');
                }
            });
        });
    }); // throw

    describe('truthy', function () {
        it('should match an array', function () {
            expect([]).to.be.truthy();

            try {
                expect([]).to.not.be.truthy();
            }
            catch (e) {
                expect(e.message).to.be('Expected [] to be falsy');
            }
        });
        it('should match true', function () {
            expect(true).to.be.truthy();
        });
        it('should match a non-empty string', function () {
            expect('abc').to.be.truthy();
        });
        it('should match a non-zero number', function () {
            expect(1).to.be.truthy();
        });
        it('should match an object', function () {
            expect({}).to.be.truthy();
        });

        describe('not', function () {
            it('should not match empty string', function () {
                expect('').not.to.be.truthy();
                expect('').to.not.be.truthy();

                try {
                    expect('').to.be.truthy();
                }
                catch (e) {
                    expect(e.message).to.be(`Expected "" to be truthy`);
                }
            });
            it('should not match false', function () {
                expect(false).not.to.be.truthy();
                expect(false).to.not.be.truthy();
            });
            it('should not match NaN', function () {
                expect(NaN).not.to.be.truthy();
                expect(NaN).to.not.be.truthy();
            });
            it('should not match null', function () {
                expect(null).not.to.be.truthy();
                expect(null).to.not.be.truthy();
            });
            it('should not match undefined', function () {
                expect(undefined).not.to.be.truthy();
                expect(undefined).to.not.be.truthy();
            });
            it('should not match zero', function () {
                expect(0).not.to.be.truthy();
                expect(0).to.not.be.truthy();
            });
        });
    });

    describe('within', function () {
        describe('default ranges', function () {
            it('should handle value below lower-bound', function () {
                expect(-1).not.to.be.within(0, 2);
                expect(-1).to.not.be.within(0, 2);
            });

            it('should handle value at lower-bound', function () {
                expect(0).to.be.within(0, 2);
            });

            it('should handle contained value', function () {
                expect(1).to.be.within(0, 2);
            });

            it('should handle value at upper-bound', function () {
                expect(2).to.be.within(0, 2);
            });

            it('should handle value above upper-bound', function () {
                expect(4).not.to.be.within(0, 2);
                expect(4).to.not.be.within(0, 2);
            });
        });

        describe('closed-closed ranges', function () {
            it('should handle value below lower-bound', function () {
                expect(-1).not.to.be.within(0, 2, '[]');
                expect(-1).not.to.be.within('[0, 2]');
                expect(-1).to.not.be.within('[0, 2]');
            });

            it('should handle value at lower-bound', function () {
                expect(0).to.be.within(0, 2, '[]');
                expect(0).to.be.within('[0, 2]');
            });

            it('should handle contained value', function () {
                expect(1).to.be.within(0, 2, '[]');
                expect(1).to.be.within('[0, 2]');
            });

            it('should handle value at upper-bound', function () {
                expect(2).to.be.within(0, 2, '[]');
                expect(2).to.be.within('[0, 2]');
            });

            it('should handle value above upper-bound', function () {
                expect(4).not.to.be.within(0, 2, '[]');
                expect(4).not.to.be.within('[0, 2]');
                expect(4).to.not.be.within('[0, 2]');
            });
        });

        describe('closed-open ranges', function () {
            it('should handle value below lower-bound', function () {
                expect(-1).not.to.be.within(0, 2, '[)');
                expect(-1).not.to.be.within('[0, 2)');
                expect(-1).to.not.be.within('[0, 2)');
            });

            it('should handle value at lower-bound', function () {
                expect(0).to.be.within(0, 2, '[)');
                expect(0).to.be.within('[0, 2)');
            });

            it('should handle contained value', function () {
                expect(1).to.be.within(0, 2, '[)');
                expect(1).to.be.within('[0, 2)');
            });

            it('should handle value at upper-bound', function () {
                expect(2).not.to.be.within(0, 2, '[)');
                expect(2).not.to.be.within('[0, 2)');
                expect(2).to.not.be.within('[0, 2)');
            });

            it('should handle value above upper-bound', function () {
                expect(4).not.to.be.within(0, 2, '[)');
                expect(4).not.to.be.within('[0, 2)');
                expect(4).to.not.be.within('[0, 2)');
            });
        });

        describe('open-closed ranges', function () {
            it('should handle value below lower-bound', function () {
                expect(-1).not.to.be.within(0, 2, '(]');
                expect(-1).not.to.be.within('(0, 2]');
                expect(-1).to.not.be.within('(0, 2]');
            });

            it('should handle value at lower-bound', function () {
                expect(0).not.to.be.within(0, 2, '(]');
                expect(0).to.not.be.within(0, 2, '(]');
                expect(0).not.to.be.within('(0, 2]');
                expect(0).to.not.be.within('(0, 2]');
            });

            it('should handle contained value', function () {
                expect(1).to.be.within(0, 2, '(]');
                expect(1).to.be.within('(0, 2]');
            });

            it('should handle value at upper-bound', function () {
                expect(2).to.be.within(0, 2, '(]');
                expect(2).to.be.within('(0, 2]');
            });

            it('should handle value above upper-bound', function () {
                expect(4).not.to.be.within(0, 2, '(]');
                expect(4).not.to.be.within('(0, 2]');
                expect(4).to.not.be.within('(0, 2]');
            });
        });

        describe('open-open ranges', function () {
            it('should handle value below lower-bound', function () {
                expect(-1).not.to.be.within(0, 2, '()');
                expect(-1).not.to.be.within('(0, 2)');
                expect(-1).to.not.be.within('(0, 2)');
            });

            it('should handle value at lower-bound', function () {
                expect(0).not.to.be.within(0, 2, '()');
                expect(0).to.not.be.within(0, 2, '()');
                expect(0).not.to.be.within('(0, 2)');
                expect(0).to.not.be.within('(0, 2)');
            });

            it('should handle contained value', function () {
                expect(1).to.be.within(0, 2, '()');
                expect(1).to.be.within('(0, 2)');
            });

            it('should handle value at upper-bound', function () {
                expect(2).not.to.be.within(0, 2, '()');
                expect(2).not.to.be.within('(0, 2)');
                expect(2).to.not.be.within('(0, 2)');
            });

            it('should handle value above upper-bound', function () {
                expect(4).not.to.be.within(0, 2, '()');
                expect(4).not.to.be.within('(0, 2)');
                expect(4).to.not.be.within('(0, 2)');
            });
        });
    }); // within

    describe('Promises', function () {
        let emptyFn = () => {};

        beforeEach(function () {
            A.log = [];
        });

        afterEach(function () {
            expect(A._previous === null).to.be(true);
            A.log = null;
        });

        function delay (ms, value) {
            return new A.Promise((resolve, reject) => {
                setTimeout(() => {
                    if (value instanceof Error) {
                        reject(value);
                    }
                    else {
                        resolve(value);
                    }
                }, ms);
            });
        }

        it('should wait for expectation to resolve', function () {
            return expect('xyz').to.be(delay(10, 'xyz')).then(() => {
                let a = A.log[0];

                expect(A.log.length).to.be(1);
                expect(a.failed).to.be(false);
                expect(a.value).to.be('xyz');
                expect(a.expected).to.equal(['xyz']);
            });
        });

        it('should wait for expectation and value to resolve', function () {
            return expect(delay(20, 'def')).to.be(delay(10, 'def')).then(() => {
                let a = A.log[0];

                expect(A.log.length).to.be(1);
                expect(a.failed).to.be(false);
                expect(a.value).to.be('def');
                expect(a.expected).to.equal(['def']);
            });
        });

        it('should wait for value to resolve', function () {
            return expect(delay(10, 'abc')).to.be('abc').then(() => {
                let a = A.log[0];

                expect(A.log.length).to.be(1);
                expect(a.failed).to.be(false);
                expect(a.value).to.be('abc');
                expect(a.expected).to.equal(['abc']);
            });
        });

        it('should wait for value and expectation to resolve', function () {
            let o = {a: 1};
            let v = {a: 1};

            return expect(delay(10, o)).to.equal(delay(20, v)).then(() => {
                let a = A.log[0];

                expect(A.log.length).to.be(1);
                expect(a.failed).to.be(false);
                expect(a.value).to.be(o);
                expect(a.expected).to.be.same([v]);
            });
        });

        it('should wait for value and expectation to resolve and report failure', function () {
            let o = {a: 1};
            let v = {a: 2};

            return expect(delay(10, o)).to.equal(delay(20, v)).then(() => {
                throw new Error('Expected values to not match');
            }, e => {
                let a = A.log[0];

                expect(A.log.length).to.be(1);
                expect(a.failed).to.be(`Expected {"a":1} to equal {"a":2}`);
                expect(a.value).to.be(o);
                expect(a.expected).to.be.same([v]);
            });
        });

        it('should handle value rejection', function () {
            return expect(delay(10, new Error('Boom'))).to.be('abc').then(() => {
                throw new Error('Rejection did not propagate.');
            },
            e => {
                let a = A.log[0];

                expect(A.log.length).to.be(1);
                expect(a.failed).to.be.an('error');
                expect(a.failed.message).to.be('Boom');
            });
        });

        it('should handle expectation rejection', function () {
            return expect('abc').to.be(delay(10, new Error('Bam'))).then(() => {
                throw new Error('Rejection did not propagate.');
            },
            e => {
                let a = A.log[0];

                expect(A.log.length).to.be(1);
                expect(a.failed).to.be.an('error');
                expect(a.failed.message).to.be('Bam');
            });
        });

        it('should handle out-of-order expectation completion', function () {
            expect(delay(20, 'xyz')).to.be('xyz');

            // The first delay will complete much later then the next one:
            return expect('abc').to.be(delay(0, 'abc')).then(() => {
                let a = A.log[0];

                expect(A.log.length).to.be(2);

                // But the report should be in order:
                expect(a.failed).to.be(false);
                expect(a.value).to.be('xyz');
                expect(a.expected).to.equal(['xyz']);

                a = A.log[1];
                expect(a.failed).to.be(false);
                expect(a.value).to.be('abc');
                expect(a.expected).to.equal(['abc']);
            });
        });

        it('should handle out-of-order expectation failures', function () {
            expect(delay(20, 'xyz')).to.be('def');

            // The first delay will complete much later then the next one:
            return expect('abc').to.be(delay(0, 'abc')).then(() => {
                throw new Error('Expectation failure did not propagate');
            },
            e => {
                let log = A.log;
                let a = log[0];

                expect(log.length).to.be(1);
                expect(e.message).to.be(`Expected "xyz" to be "def"`);

                // But the report should be in order:
                expect(a.failed).to.be(e.message);
                expect(a.value).to.be('xyz');
                expect(a.expected).to.equal(['def']);
            });
        });

        it('should handle out-of-order expectation rejection', function () {
            expect(delay(20, new Error('Zap!'))).to.be('xyz');

            // The first delay will complete much later then the next one:
            return expect('abc').to.be(delay(0, 'abc')).then(() => {
                throw new Error('Rejection did not propagate');
            },
            e => {
                let a = A.log[0];

                expect(A.log.length).to.be(1);

                expect(a.failed).to.be.an('error');
                expect(a.failed.message).to.be('Zap!');
            });
        });
    });
}

describe('Assert', function () {
    masterSuite(Assert);
});
