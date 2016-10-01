'use strict;'
const assert = require('assert');
const expect = require('chai').expect;
const lh = require('./../index.js');
const classes = require('./../../../classes.js');
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
    let generate_matrix = () =>  {

    }
    
});