// @todo: Add support for n number of points.
export const Pair = class {
    x: any;
    y: any;
    constructor(x: any, y: any) {
        if (arguments.length == 1) {
            if (Array.isArray(x)) {
                this.x = x[0];
                this.y = x[1];
            } else {
                this.x = x;
            }
        } else {
            this.x = x;
            this.y = y;
        }
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
};

/**
 *  You can implicitly substitute x for player_one's payoff,
 *  and y for player_two's payoff.
 */
export const Payoff = class extends Pair {
    // lth: larger_than_horizontal
    lth(other) {
        return (this.y > other.y);
    }

    // ltv: larger than vertical
    ltv(other) {
        return (this.x > other.x);
    }
};

/**
 *  Assume that only a leaf node can have a value.
 *  An intermediate decision node doesn't cary a value.
 */
export const TreeNode = class {
    payoff: any;
    node_name: any;
    children: any;
    value: any;
    move: any;
    constructor(name:string, payoff: any) {
        this.node_name = name;
        this.payoff = payoff
        this.value = 0
        this.children = [];
    }

    add_child(child) {
        this.children.push(child);
    }

    is_leaf() {
        return (this.children.length === 0);
    }

    get_value(player) {
        if (player == 1) {
            return this.payoff.x;
        }
        return this.payoff.y;
    }
};