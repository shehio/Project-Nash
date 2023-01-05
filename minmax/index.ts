// This code doesn't return the current move.
// It returns where will eventually end up.

// player == 0 is player 1
// while player == 1, is player 2
export function minmax(root, player) {
    let min = false;
    if (player == 0) {
        min = true;
    }
    if (root.is_leaf()) {
        console.log('Leaf, returning, value:  ' + root.name)
        console.log('Leafs payoff: ' + root.payoff)
        if (min) {
            root.value = root.payoff.x
        } else {
            root.value = root.payoff.y
        }
        
        return root
    }

    var move = null;
    var maximum = -Infinity;
    var minimum = Infinity;

    for(let i = 0; i < root.children.length; i++) {
        let child  = root.children[i];
        console.log(child.name)
        var result = minmax(child, 1 - player);
        if (min) {
            if (root.value < minimum) {
                minimum = result.payoff.x;
                move = result;
            }
        }
        else {
            if (root.value > maximum) {
                maximum = result.payoff.y;
                move = result;
            }
        }
    }

    return move;
}