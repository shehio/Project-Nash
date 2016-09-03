'use strict;'
const assert = require('assert');
const expect = require('chai').expect;
const classes = require('./../classes.js')
const Payoff = classes.Payoff;
const Pair = classes.Pair;
const nash = require('./../index.js');

var prisoners_dilemma = function () {
    var matrix = new Array();
    var arr = [new Payoff(-1, -1), new Payoff(-10, 0)];
    matrix.push(arr);
    arr = [new Payoff(0, -10), new Payoff(-5, -5)];
    matrix.push(arr);
    return matrix;
}

var matching_pennies = function () {
    var matrix = new Array();
    var arr = [new Payoff(1, -1), new Payoff(-1, 1)];
    matrix.push(arr);
    arr = [new Payoff(-1, 1), new Payoff(1, -1)];
    matrix.push(arr);
    return matrix;
}

describe('prisoners dilemma: ', () => {
    var matrix = null;
    before(() => { matrix = prisoners_dilemma(); });
    it('tests check_neighbors', (done) => {
        var cn = (i, j) => nash.check_neighbors(matrix, i, j);
        assert.equal(cn(0, 0), false);
        assert.equal(cn(0, 1), false);
        assert.equal(cn(1, 0), false);
        assert.equal(cn(1, 1), true);
        done();
    });

    it('has a pure nash equilibrium', done => {
        var expected = { x: 1, y: 1 };
        var pure = nash.find_pure(matrix);
        expect(pure).to.not.be.undefined;
        expect(pure).to.not.be.null;
        expect(pure).to.be.a('Array');
        expect(pure).to.not.be.empty;
        expect(pure.shift()).to.eql(expected);
        done();
    });
});

describe('matching pennies: ', () => {
    before(() => { matrix = matching_pennies(); });
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
});