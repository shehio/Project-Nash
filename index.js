const classes = require('./classes.js')
const Payoff = classes.Payoff;
const Pair = classes.Pair;
const rows = 2;
const cols = 2;

/**
 *  Strive for no side effects.
 */

function find_pure(matrix) {
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
/**
 *  As always, player one is represented by x in (x,y) coordinates, 
 *  and his/her choices is represented vertically.
 *  The exact opposite for player two.
 */
function check_neighbors(matrix, row, col) {
    var bool = true;
    var vertical = 1 - row;
    var horizontal = 1 - col;
    current = matrix[row][col];
    return (current.ltv(matrix[vertical][col])
        && current.lth(matrix[row][horizontal]));
}

module.exports = {
    check_neighbors: check_neighbors, 
    find_pure: find_pure
}