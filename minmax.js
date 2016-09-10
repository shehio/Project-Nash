function minmax(root, player) {
    let starting = false;
    if (player == 1) {
        starting = true;
    }
    if (root.is_leaf()) {
        return root;
    }
    var ret = null;
    var max = -Infinity;
    for(let i = 0; i < root.children.length; i++) {
        let child  = root.children[i];
        var result = minmax(child, 1 - player);
        if (starting) {
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

module.exports = {
    minmax: minmax,
    minimax: minmax
}