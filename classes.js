// @todo: shouldn't be called Pair anymore, add support for n number of points.
var Pair = class 
{
    constructor(x, y) 
    {
        if (arguments.length == 1) 
        {
            if (Array.isArray(x)) 
            {
                this.x = x[0];
                this.y = x[1];
            }
            else 
            {
                this.x = x;
            }
        }
        else 
        {
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
var Payoff = class extends Pair
{
    // lth: larger_than_horizontal
    lth(other)
    {
        return (this.y > other.y);
    }

    // ltv: larger than vertical
    ltv(other) 
    {
        return (this.x > other.x);
    }
};

/**
 *  let's begin with the assumption that only a leaf node can have a value, 
 *  or an intermediate decision node doesn't cary a value.
 */
var Node = class
{
    constructor(value) 
    {
        this.value = value;
        this.children = [];
    }

    add_child(child) 
    {
        this.children.push(child);
    }

    is_leaf() 
    {
        return (this.children.length === 0);
    }

    value(player) 
    {
        if (player == 1) 
        {
            return this.value.x;
        }
        return this.value.y;
    }
};

module.exports = {
    Payoff: Payoff,
    Pair: Pair,
    Node: Node
};