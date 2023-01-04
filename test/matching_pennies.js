"use strict";
exports.__esModule = true;
var assert = require('assert');
var expect = require('chai').expect;
var types_1 = require("../types");
var index_1 = require("../index");
var matching_pennies = function () {
    var matrix = new Array();
    matrix.push([new types_1.Pair(1, -1), new types_1.Pair(-1, 1)]);
    matrix.push([new types_1.Pair(-1, 1), new types_1.Pair(1, -1)]);
    return matrix;
};
describe('matching pennies', function () {
    var matrix = new Array();
    before(function () { return matrix = matching_pennies(); });
    it('tests check_neighbors', function (done) {
        var rows = 2;
        var cols = 2;
        var cn = function (i, j) { return (0, index_1.check_neighbors)(matrix, i, j); };
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; ++j) {
                assert.equal(cn(i, j), false);
            }
        }
        done();
    });
    it('does not have a pure nash equilibrium', function (done) {
        var pure = (0, index_1.find_pure_strategy_payoff)(matrix);
        validateArray(matrix);
        done();
    });
    it('has mixed nash equilibrium', function (done) {
        var expected = { p: 0.5, average_payoff: 0 };
        var mixed = (0, index_1.find_mixed_strategy_payoff)(matrix);
        validateArray(mixed);
        expect(mixed).to.have.lengthOf(2);
        var p1 = mixed.shift();
        expect(p1).to.not.be["null"];
        expect(p1).to.not.be.undefined;
        expect(p1).to.be.eql(expected);
        var p2 = mixed.shift();
        expect(p2).to.not.be["null"];
        expect(p2).to.not.be.undefined;
        expect(p2).to.be.eql(expected);
        done();
    });
});
function validateArray(arr) {
    expect(arr).to.not.be["null"];
    expect(arr).to.not.be.undefined;
    expect(arr).to.be.a('Array');
    expect(arr).to.not.be.empty;
}
