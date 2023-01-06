import { Pair } from '../types'
const rows = 2;
const cols = 2;

/**
 *  As always, player one is represented by x in (x,y) coordinates, 
 *  and their choices are represented vertically.
 *  Player two is represented by y in (x,y) coordinates,
 *  and their choices are represented horizontally.
 */
export function check_neighbors(matrix, row, col) 
{
    let vertical = 1 - row;
    let horizontal = 1 - col;
    let current = matrix[row][col];
    return (current.ltv(matrix[vertical][col]) && current.lth(matrix[row][horizontal]));
}


export function find_pure_strategy_payoff(matrix) {
    var pure = new Array();
    for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < cols; ++j) {
            if (check_neighbors(matrix, i, j)) {
                pure.push(new Pair(i, j));
            }
        }
    }
    return pure;
}

export function find_mixed_strategy_payoff(matrix) {
    var mixed = new Array();
    let r1c1 = matrix[0][0];
    let r1c2 = matrix[0][1];
    let r2c1 = matrix[1][0];
    let r2c2 = matrix[1][1];

    // p: probability that player one plays his/her first choice.
    let p = (r2c2.y - r2c1.y) / (r1c1.y + r2c2.y - r2c1.y - r1c2.y);
    let p1_average_payoff = r1c1.y * p + (1 - p) * r2c1.y; // or r1c2.y * p + (1 - p)  * r2c2.y

    // q: probability that player two plays his/her first choice.
    let q = (r2c2.x - r1c2.x) / (r1c1.x + r2c2.x - r2c1.x - r1c2.x);
    let p2_average_payoff = r1c1.x * q + (1 - q) * r1c2.x; // or r2c1.x * p + (1 - p)  * r2c2.x

    mixed.push({ p: p, average_payoff: p1_average_payoff });
    mixed.push({ p: q, average_payoff: p2_average_payoff });

    return mixed;
}