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

module.exports = {
    Payoff: Payoff,
    Pair: Pair
}