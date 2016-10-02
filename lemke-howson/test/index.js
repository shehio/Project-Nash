'use strict;'
const assert = require('assert');
const expect = require('chai').expect;
const lh = require('./../index.js');
const classes = require('./../../classes.js');
const Payoff = classes.Payoff;
const Pair = classes.Pair;

describe('range: ', () => {
    it('throws an exception on no arguements', (done) => {
        assert.throws(function () { lh.range() }, Error, 'range function must have at least one arguement.');
        done();
    });
    it('works on a single arguement', (done) => {
        let expected = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
        let generated = lh.range(10);
        expect(generated).to.be.eql(expected);
        done();
    });
    it('default step equals one', (done) => {
        let expected = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let generated = lh.range(1, 10);
        expect(generated).to.be.eql(expected);
        done();
    });
    it('generates numbers accordingly', (done) => {
        let expected = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let generated = lh.range(1, 10, 1);
        expect(generated).to.be.eql(expected);
        done();
    });
});

/**
 *  @todo: change this!
 */
describe('normalize matrix: ', () => {
    let positive = () => { return new Array(new Payoff(1, 1), new Payoff(1, 1), new Payoff(1, 1)); }
    let negative = () => { return new Array(new Payoff(-1, -1), new Payoff(-1, -1), new Payoff(-1, -1)); }
    let zero = () => { return new Array(new Payoff(0, 0), new Payoff(0, 0), new Payoff(0, 0)); }

    let generate_matrix = (generator) => {
        let matrix = new Array();
        let arr = [new Payoff(1, 1), new Payoff(2, 2), new Payoff(3, 3)];
        matrix.push(arr);
        arr = generator();
        matrix.push(arr);
        arr = [new Payoff(4, 4), new Payoff(5, 5), new Payoff(6, 6)];
        matrix.push(arr);
        return matrix;
    }
    let generate_expected_matrix = (start, i) => {
        let matrix = new Array();
        let arr = [new Payoff(1 + i, 1 + i), new Payoff(2 + i, 2 + i), new Payoff(3 + i, 3 + i)];
        matrix.push(arr);
        arr = [new Payoff(start + i, start + i), new Payoff(start + i, start + i), new Payoff(start + i, start + i)];
        matrix.push(arr);
        arr = [new Payoff(4 + i, 4 + i), new Payoff(5 + i, 5 + i), new Payoff(6 + i, 6 + i)];
        matrix.push(arr);
        return matrix;
    }
    it('works with zero', (done) => {
        let expected = generate_expected_matrix(0, 1);
        let generated = lh.normalize_matrices(generate_matrix(zero));
        expect(generated).to.be.eql(expected);
        done();
    });

    it('works with negative numbers', (done) => {
        let expected = generate_expected_matrix(-1, 2);
        let generated = lh.normalize_matrices(generate_matrix(negative));
        expect(generated).to.be.eql(expected);
        done();
    });

    it('works with positive numbers', (done) => {
        let expected = generate_expected_matrix(1, 0);
        let generated = lh.normalize_matrices(generate_matrix(positive));
        expect(generated).to.be.eql(expected);
        done();
    });
    it('throws an error on empty arguements', (done) => {
        assert.throws(function () { lh.normalize_matrices(); }, Error, 'matrix is null, or not an array.');
        done();
    });
});


describe('create tableau: ', () => {
    it('works', (done) => {
        let expected = [
            [-1, 1, 0, 0, -2, 0],
            [-2, 1, 0, 0, 0, -2],
            [-3, 1, 0, -2, 0, 0],
            [-4, 1, -2, 0, 0, 0]
        ];
        let intermediate = [
            [new Payoff(2, 0), new Payoff(0, 2)],
            [new Payoff(0, 2), new Payoff(2, 0)]
        ];
        let generated = lh.create_tableaux(intermediate);

        expect(generated).to.be.eql(expected);
        done();
    });

});
