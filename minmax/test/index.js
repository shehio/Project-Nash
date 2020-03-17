'use strict;';
const data_models = require('./../../classes.js');
const Payoff = data_models.Payoff;
const Node = data_models.Node;

var example = function () {
    var node = new Node();
    var child = new Node(new Payoff(3, 2));
    node.add_child(child);
    child = new Node(new Payoff(4, 5));
    node.add_child(child);
    return node;
};

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

};

/**
 *  @todo: add some content to these tests!
 */
describe('minmax: ', () => {
    it('works', (done) => {
        let node = example();
        done();
    });

    it('works again', (done) => {
        let node = another_example();
        done();
    });
});
