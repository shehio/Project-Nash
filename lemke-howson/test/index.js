'use strict;'
const assert = require('assert');
const expect = require('chai').expect;
const lh = require('./../index.js');
const classes = require('./../../classes.js');
const Payoff = classes.Payoff;
const Pair = classes.Pair;

describe('range: ', () => {
    it('throws an exception on no arguements', (done) => {
        expect(lh.range).to.throw('range function must have at least one arguement.');
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


describe('normalize matrix: ', () => {
    let generate_matrix = () => {
        var matrix = new Array();
        var arr = [new Payoff(1, 1), new Payoff(2, 2), new Payoff(3, 3)];
        matrix.push(arr);
        arr = [new Payoff(0, 0), new Payoff(0, 0), new Payoff(0, 0)];
        matrix.push(arr);
        arr = [new Payoff(4, 4), new Payoff(5, 5), new Payoff(6, 6)];
        matrix.push(arr);
        return matrix;
    }
    let generate_expected_matrix = () => {
        var matrix = new Array();
        var arr = [new Payoff(2, 2), new Payoff(3, 3), new Payoff(4, 4)];
        matrix.push(arr);
        arr = [new Payoff(1, 1), new Payoff(1, 1), new Payoff(1, 1)];
        matrix.push(arr);
        arr = [new Payoff(5, 5), new Payoff(6, 6), new Payoff(7, 7)];
        matrix.push(arr);
        return matrix;
    }
    it('works', (done) => {
        let expected = generate_expected_matrix();
        let generated = lh.normalize_matrices(generate_matrix());
        expect(generated).to.be.eql(expected);
        done();
    });

});