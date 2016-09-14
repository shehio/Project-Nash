const classes = require('./../classes.js');
const Payoff = classes.Payoff;
const Pair = classes.Pair;
const Node = classes.Node;

/**
 *  I rarely use mutuable objects, as they are not needed in these cases.
 *  FYI, can overflow.
 */
/**
 *  @todo: embed methods to prevent user directly access x, and y (fields) [Design of API].
 */
function normalizeMatrices(matrix) {

    if (!matrix || !matrix instanceof Array) {
        throw "matrix is null, or not an array";
    }

    // find the lowest element
    let min = Infinity;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; ++j) {
            min = Math.min(matrix[i][j].x, matrix[i][j].y, min);
        }
    }
    /**
     *  @todo: change this.
     */
    if (min < 0) {
        min = -min + 1;
    }
    else {
        return;
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; ++j) {
            matrix[i][j].x = matrix[i][j].x + min;
            matrix[i][j].y = matrix[i][j].y + min;
        }
    }
}



module.exports = {
    normalizeMatrices: normalizeMatrices
}


var matching_pennies = function () {
    var matrix = new Array();
    var arr = [new Payoff(1, -1), new Payoff(-1, 1)];
    matrix.push(arr);
    arr = [new Payoff(-1, 1), new Payoff(1, -1)];
    matrix.push(arr);
    return matrix;
}


console.log(matching_pennies());
var mat = matching_pennies();
normalizeMatrices(mat);
console.log(mat);