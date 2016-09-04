'use strict;'
const assert = require('assert');
const expect = require('chai').expect;
const classes = require('./../classes.js')
const Payoff = classes.Payoff;
const Pair = classes.Pair;
const nash = require('./../index.js');

var example = function () {
    var matrix = new Array();
    var arr = [new Payoff(3, -3), new Payoff(-2, 2)];
    matrix.push(arr);
    arr = [new Payoff(-1, 1), new Payoff(0, 0)];
    matrix.push(arr);
    return matrix;
}

describe('random example: ', () => {
    before(() => matrix = example());
    it('tests check_neighbors', (done) => {
        const rows = 2;
        const cols = 2;
        var cn = (i, j) => nash.check_neighbors(matrix, i, j);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; ++j) {
                assert.equal(cn(i, j), false);
            }
        }
        done();
    });

    it('doesnt have a pure nash equilibrium', done => {
        var pure = nash.find_pure(matrix);
        expect(pure).to.not.be.undefined;
        expect(pure).to.not.be.null;
        expect(pure).to.be.a('Array');
        expect(pure).to.be.empty;
        done();
    });

    it('has mixed nash equilibrium', done => {
        /**
         *  @todo: change the extremely error prone decimals, to nearly equal.
         */
        var p1_expected = { p: 0.16666666666666666, average_payoff: 0.33333333333333337 };
        var p2_expected = { p: 0.3333333333333333, average_payoff: -0.3333333333333335 };
        var mixed = nash.find_mixed(matrix);
        expect(mixed).to.not.be.null;
        expect(mixed).to.not.be.undefined;
        expect(mixed).to.be.a('Array');
        expect(mixed).to.not.be.empty;
        expect(mixed).to.have.lengthOf(2);

        var p1 = mixed.shift();
        expect(p1).to.not.be.null;
        expect(p1).to.not.be.undefined;
        expect(p1).to.be.eql(p1_expected);

        var p2 = mixed.shift();
        expect(p2).to.not.be.null;
        expect(p2).to.not.be.undefined;
        expect(p2).to.be.eql(p2_expected);

        done();
    });
});