
import { Payoff, TreeNode } from '../../src/types'
import { minmax } from '../index'

var example = function () {
    var root = new TreeNode(0);
    var child = new TreeNode(new Payoff(3, 2));
    root.add_child(child);
    child = new TreeNode(new Payoff(4, 5));
    root.add_child(child);
    return root;
};

var another_example = function () {
    var root = new TreeNode(0);

    const left_child = new TreeNode('Left');
    root.add_child(left_child);

    left_child.add_child(new TreeNode(new Payoff(4, 5)));
    left_child.add_child(new TreeNode(new Payoff(3, 2)));

    const right_child = new TreeNode('Right');
    right_child.add_child(new TreeNode(new Payoff(1, 3)));
    right_child.add_child(new TreeNode(new Payoff(6, 9)));
    root.add_child(right_child);
    return root;

};

/**
 *  @todo: add some content to these tests!
 */
describe('minmax: ', () => {
    it('works', () => {
        const game_tree = example()
        const move = minmax(game_tree, 1)
        expect(move.value).toEqual(new Payoff(4, 5))

    });

    it('works again', () => {
        const game_tree = another_example()
        const move = minmax(game_tree, 1)
        expect(move.value).toEqual(new Payoff(6, 9))
    });
});
