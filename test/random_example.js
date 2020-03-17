/*jshint expr: true*/
'use strict;';
const assert = require('assert');
const expect = require('chai').expect;
const Payoff = require('./../classes.js').Payoff;
const nash = require('./../index.js');
const rows = 2;
const cols = 2;

var example = function () 
{
    let matrix = 
    [
        [new Payoff(3, -3), new Payoff(-2, 2)],
        [new Payoff(-1, 1), new Payoff(0, 0)]
    ];
    return matrix;
};

describe('random example: ', () => 
{
    let matrix = null;
    before(() => matrix = example());

    it('tests check_neighbors', (done) => 
    {
        let cn = (i, j) => nash.check_neighbors(matrix, i, j);

        for (let i = 0; i < rows; i++) 
        {
            for (let j = 0; j < cols; ++j) 
            {
                assert.equal(cn(i, j), false);
            }
        }

        done();
    });

    it('doesnt have a pure nash equilibrium', done => 
    {
        let pure = nash.find_pure(matrix);
        expect(pure).to.not.be.undefined;
        expect(pure).to.not.be.null;
        expect(pure).to.be.a('Array');
        expect(pure).to.be.empty;
        done();
    });

    it('has mixed nash equilibrium', done => 
    {
        // @todo: change the extremely error prone decimals, to nearly equal.
        let p1_expected = { p: 0.16666666666666666, average_payoff: 0.33333333333333337 };
        let p2_expected = { p: 0.3333333333333333, average_payoff: -0.3333333333333335 };
        let mixed = nash.find_mixed(matrix);
        expect(mixed).to.not.be.null;
        expect(mixed).to.not.be.undefined;
        expect(mixed).to.be.a('Array');
        expect(mixed).to.not.be.empty;
        expect(mixed).to.have.lengthOf(2);

        let p1 = mixed.shift();
        expect(p1).to.not.be.null;
        expect(p1).to.not.be.undefined;
        expect(p1).to.be.eql(p1_expected);

        let p2 = mixed.shift();
        expect(p2).to.not.be.null;
        expect(p2).to.not.be.undefined;
        expect(p2).to.be.eql(p2_expected);

        done();
    });
});