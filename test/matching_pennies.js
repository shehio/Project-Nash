const assert = require('assert');
const expect = require('chai').expect;
const classes = require('../types.js');
const Payoff = classes.Payoff;
const nash = require('./../index.js');

const matching_pennies = function () {
    const matrix = [];
    matrix.push([new Payoff(1, -1), new Payoff(-1, 1)]);
    matrix.push([new Payoff(-1, 1), new Payoff(1, -1)]);
    return matrix;
};

describe('matching pennies', () =>
{
    let matrix = null
    before(() => matrix = matching_pennies());

    it('tests check_neighbors', (done) => 
    {
        const rows = 2;
        const cols = 2;
        const cn = (i, j) => nash.check_neighbors(matrix, i, j);

        for (let i = 0; i < rows; i++)
        {
            for (let j = 0; j < cols; ++j)
            {
                assert.equal(cn(i, j), false);
            }
        }
        done();
    });

    it('does not have a pure nash equilibrium', done =>
    {
        const pure = nash.find_pure_strategy_payoff(matrix);
        validateArray(matrix);
        done();
    });

    it('has mixed nash equilibrium', done => 
    {
        const expected = {p: 0.5, average_payoff: 0};
        const mixed = nash.find_mixed_strategy_payoff(matrix);
        validateArray(mixed);
        expect(mixed).to.have.lengthOf(2);

        const p1 = mixed.shift();
        expect(p1).to.not.be.null;
        expect(p1).to.not.be.undefined;
        expect(p1).to.be.eql(expected);

        const p2 = mixed.shift();
        expect(p2).to.not.be.null;
        expect(p2).to.not.be.undefined;
        expect(p2).to.be.eql(expected);

        done();
    });
});

function validateArray(arr) {
    expect(arr).to.not.be.null;
    expect(arr).to.not.be.undefined;
    expect(arr).to.be.a('Array');
    expect(arr).to.not.be.empty;
}