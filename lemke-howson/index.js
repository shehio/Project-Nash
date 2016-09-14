const classes = require('./../classes.js');
const Payoff = classes.Payoff;
const Pair = classes.Pair;
const Node = classes.Node;
const zero = 0;
const one = 1;
const two = 2;
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


function createTableaux(matrix) {
    if (!matrix || !matrix instanceof Array) {
        throw "matrix is null, or not an array.";
    }
    if (matrix.length == 0) {
        throw "matrix is empty."
    }
    /**
     *  Assume the matrix is 'regular', and now it's safe to check that after prior checks.
     */
    let strategies = matrix.length + matrix[0].length;
    let p1s = matrix.length;
    let p2s = matrix[0].length;
    /**
     *  Should have an (s) by (s + 2) matrix (two more columns)
     */
    let tableaux = new Array(strategies);
    for (let i = 0; i < tableaux.length; i++) {
        tableaux[i] = Array.apply(null, Array(strategies + 2)).map(Number.prototype.valueOf, 0);
    }
    /**
     * 
     */
    for (let i = 0; i < tableaux.length; i++) {
        tableaux[i][zero] = - (i + 1);
    }
    /**
     * 
     */
    for (let i = 0; i < tableaux.length; i++) {
        tableaux[i][one] = 1;
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            tableaux[i + p1s][j + two] = matrix[i][j].y;
            tableaux[i][j + two + p2s] = matrix[i][j].x;
        }
    }
    return tableaux;

}

module.exports = {
    normalizeMatrices: normalizeMatrices,
    createTableaux: createTableaux
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
console.log(createTableaux(mat));
