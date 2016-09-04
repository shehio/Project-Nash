var Pair = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

/**
 *  You can implicitly substitute x for player_one's payoff,
 *  and y for player_two's payoff.
 */
var Payoff = class extends Pair {
    /**
     * lth: larger_than_horizontal
     */
    lth(other) {
        return (this.y > other.y);
    }
    /**
     * ltv: larger than vertical
     */
    ltv(other) {
        return (this.x > other.x);
    }
};

/**
 *  let's begin with the assumption that only a leaf node can have a value, 
 *  or an intermediate decision node doesn't cary a value.
 */
var Node = class {

    constructor(value) {
        this.value = value;
        this.children = new Array();
    }

    add_child(child) {
        this.children.push(child);
    }

    is_leaf () {
        return (this.children.length == 0);
    }

    value(player) {
        if (player == 1) {
            return this.value.x;
        }
        return this.value.y;
    }
}

module.exports = {
    Payoff: Payoff,
    Pair: Pair, 
    Node: Node
}