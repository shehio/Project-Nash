const assert = require('assert');
const expect = require('chai').expect;
const Payoff = require('../types.js').Payoff;
const nash = require('./../index.js');

const prisoners_dilemma = function ()
{
    let matrix =
        [
            [new Payoff(-1, -1), new Payoff(-10, 0)],
            [new Payoff(0, -10), new Payoff(-5, -5)]
        ];
    return matrix;
};

describe('prisoners dilemma: ', () => 
{
    let matrix = null;
    before(() => matrix = prisoners_dilemma());

    it('tests check_neighbors', (done) => 
    {
        let cn = (i, j) => nash.check_neighbors(matrix, i, j);
        assert.equal(cn(0, 0), false);
        assert.equal(cn(0, 1), false);
        assert.equal(cn(1, 0), false);
        assert.equal(cn(1, 1), true);
        done();
    });

    it('has a pure nash equilibrium', done => 
    {
        let expected = { x: 1, y: 1 };
        let pure = nash.find_pure_strategy_payoff(matrix);
        expect(pure).to.not.be.undefined;
        expect(pure).to.not.be.null;
        expect(pure).to.be.a('Array');
        expect(pure).to.not.be.empty;
        expect(pure.shift()).to.eql(expected);
        done();
    });
});
