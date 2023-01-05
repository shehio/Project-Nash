
import { Payoff, TreeNode } from '../../src/types'
import { minmax } from '../index'

var example = function () {
    var root = new TreeNode('root', new Payoff(0, 0));
    root.add_child(new TreeNode('left', new Payoff(3, 2)));
    root.add_child(new TreeNode('right', new Payoff(4, 5)));
    return root;
};

var another_example = function () {
    var root = new TreeNode('root', null);

    const left_child = new TreeNode('left', null);
    root.add_child(left_child);

    left_child.add_child(new TreeNode('l1', new Payoff(4, 5)));
    left_child.add_child(new TreeNode('l2', new Payoff(3, 2)));

    const right_child = new TreeNode('right', null);
    root.add_child(right_child);

    right_child.add_child(new TreeNode('r1', new Payoff(1, 3)));
    right_child.add_child(new TreeNode('r2', new Payoff(6, 9)));

    return root;
};

/**
 *  @todo: add some content to these tests!
 */
describe('minmax: ', () => {
    it('works', () => {
        const game_tree = example()
        const move = minmax(game_tree, 0)
        expect(game_tree.move.payoff).toEqual(new Payoff(4, 5))

    });

    it('works again', () => {
        const game_tree = another_example()
        const move = minmax(game_tree, 0)
        expect(game_tree.move.payoff).toEqual(new Payoff(3, 2))
    });
});
