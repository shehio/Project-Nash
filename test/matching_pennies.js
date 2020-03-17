/*jshint expr: true*/
'use strict;';
const assert = require('assert');
const expect = require('chai').expect;
const classes = require('./../classes.js');
const Payoff = classes.Payoff;
const nash = require('./../index.js');

var matching_pennies = function () 
{
    var matrix = [];
    var arr = [new Payoff(1, -1), new Payoff(-1, 1)];
    matrix.push(arr);
    arr = [new Payoff(-1, 1), new Payoff(1, -1)];
    matrix.push(arr);
    return matrix;
};

describe('matching pennies: ', () => 
{
    let matrix = null
    before(() => matrix = matching_pennies());

    it('tests check_neighbors', (done) => 
    {
        const rows = 2;
        const cols = 2;
        var cn = (i, j) => nash.check_neighbors(matrix, i, j);

        for (var i = 0; i < rows; i++)
        {
            for (var j = 0; j < cols; ++j) 
            {
                assert.equal(cn(i, j), false);
            }
        }
        done();
    });

    it('doesnt have a pure nash equilibrium', done => 
    {
        var pure = nash.find_pure(matrix);
        expect(pure).to.not.be.undefined;
        expect(pure).to.not.be.null;
        expect(pure).to.be.a('Array');
        expect(pure).to.be.empty;
        done();
    });

    it('has mixed nash equilibrium', done => 
    {
        var expected = { p: 0.5, average_payoff: 0 };
        var mixed = nash.find_mixed(matrix);
        expect(mixed).to.not.be.null;
        expect(mixed).to.not.be.undefined;
        expect(mixed).to.be.a('Array');
        expect(mixed).to.not.be.empty;
        expect(mixed).to.have.lengthOf(2);

        var p1 = mixed.shift();
        expect(p1).to.not.be.null;
        expect(p1).to.not.be.undefined;
        expect(p1).to.be.eql(expected);

        var p2 = mixed.shift();
        expect(p2).to.not.be.null;
        expect(p2).to.not.be.undefined;
        expect(p2).to.be.eql(expected);

        done();
    });
});
