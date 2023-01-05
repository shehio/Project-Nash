// If player == 0 --> max
// If player == 1 --> min
export function minmax(root, player) {
    if (root.is_leaf()) {
        root.value = root.payoff.x
        return root
    }

    var move = null;
    var maximum = -Infinity;
    var minimum = Infinity;

    for(let i = 0; i < root.children.length; i++) {
        let child  = root.children[i];
        var result = minmax(child, 1 - player);

        if (player == 0) {
            if (child.value > maximum) {
                maximum = result.payoff.x;
                move = result;
            }
        } else {
            if (child.value < minimum) {
                minimum = result.payoff.x;
                move = result;
            }
        }
    }
    
    if (player == 0) {
        root.value = maximum
    } else {
        root.value = minimum
    }

    root.move = move

    return move
}