const classes = require('./classes.js')
const Payoff = classes.Payoff;
const Pair = classes.Pair;
const rows = 2;
const cols = 2;

var matrix = new Array();
var pure = new Array();

/**
 *  Strive for no side effects.
 */

function prepare_data() {
    var arr = [new Payoff(-1, -1), new Payoff(-10, 0)];
    matrix.push(arr);
    arr = [new Payoff(0, -10), new Payoff(-5, -5)];
    matrix.push(arr);
}


function find_pure() {
    for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < cols; ++j) {
            if (check_neighbors(i, j)) {
                pure.push(new Pair(i, j));
                console.log(pure);
            }
        }
    }
}
/**
 *  As always, player one is represented by x in (x,y) coordinates, 
 *  and his/her choices is represented vertically.
 *  The exact opposite for player two.
 */
function check_neighbors(row, col) {
    var bool = true;
    var vertical = 1 - row;
    var horizontal = 1 - col;
    current = matrix[row][col];
    return (current.ltv(matrix[vertical][col])
        && current.lth(matrix[row][horizontal]));
}

prepare_data();
find_pure();
