'use strict;'
const assert = require('assert');
const expect = require('chai').expect;
const classes = require('./../classes.js')
const Payoff = classes.Payoff;
const Pair = classes.Pair;
const Node = classes.Node;
const nash = require('./../index.js');
const mm = require('./../minmax.js');

var example = function () {
    var node = new Node();
    var child = new Node(new Payoff(3, 2));
    node.add_child(child);
    child = new Node(new Payoff(4, 5));
    node.add_child(child);
    return node;
}
var another_example = function () {
    var node = new Node();
    var child = new Node();
    child.add_child(new Node(new Payoff(4, 5)));
    child.add_child(new Node(new Payoff(3, 2)));
    node.add_child(child);
    child = new Node();
    child.add_child(new Node(new Payoff(1, 3)));
    child.add_child(new Node(new Payoff(6, 9)));
    node.add_child(child);
    return node;

}
describe('minmax: ', () => {
    it('works', (done) => {
        node = example();
        console.log(mm.minmax(node, 1));
        done();
    });

    it('works again', (done) => {
        node = another_example();
        console.log(mm.minmax(node, 1));
        done();
    });
});