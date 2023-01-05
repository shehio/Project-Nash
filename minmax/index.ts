// This code doesn't return the current move.
// It returns where will eventually end up.
export function minmax(root, player) {
    let min = false;
    if (player == 0) {
        min = true;
    }
    if (root.is_leaf()) {
        return root;
    }

    var ret = null;
    var max = -Infinity;

    for(let i = 0; i < root.children.length; i++) {
        let child  = root.children[i];
        var result = minmax(child, 1 - player);
        if (min) {
            if (result.value.x > max) {
                max = result.value.x;
                ret = result;
            }
        }
        else {
            if (result.value.y > max) {
                max = result.value.y;
                ret = result;
            }
        }
    }
    return ret;
}