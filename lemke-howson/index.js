const classes = require('./../classes.js');
const Payoff = classes.Payoff;
const Pair = classes.Pair;
const Node = classes.Node;
const zero = 0;
const one = 1;
const two = 2;

/**
 *  move this to a separate file.
 */
function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
}



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
            tableaux[i + p1s][j + two] = - matrix[i][j].y;
            tableaux[i][j + two + p2s] = - matrix[i][j].x;
        }
    }
    return tableaux;

}

// 2 cols, and -1 to transfer ebVar from 1-based to 0-based
var varToCol = (x) => Math.abs(x) + 2 - 1;

var getRowNums = (x, p1s, matrix) => {
    if (-p1s <= x < 0 || x > p1s) {
        return range(0, p1s);
    }
    //if it's negative and less, or positive and less. or equals.
    else {
        return range(p1s, matrix.length);
    }
}
function makePivotingStep(matrix, p1s, ebVar) {
    // if entering var is more or equal zero, or the entering is more than the rows.
    if (Math.abs(ebVar) <= 0 || Math.abs(ebVar) > matrix.length) {
        throw ('Selected variable index is invalid.');
    }
    // if player's one strategies are less than zero, or player's  one strategies are more than the rows
    if (p1s < 0 || matrix.length <= p1s) {
        throw ('Invalid number of strategies for player 1.');
    }

    let lbVar = 0;
    let min = Infinity;
    let rows = getRowNums(ebVar, p1s, matrix);
    let col = varToCol(ebVar);
    let lbVarCoeff = 0;
    for (let i of rows) {
        if (matrix[i][col] < 0) {
            let ratio = -matrix[i][1] / matrix[i][col];
            if (min > ratio) {
                min = ratio;
                lbVar = matrix[i][0];
                lbVarRow = i;
                lbVarCoeff = matrix[i][col];
            }
        }
    }

    matrix[lbVarRow][zero] = ebVar;
    matrix[lbVarRow][varToCol(ebVar)] = zero;
    matrix[lbVarRow][varToCol(lbVar)] = -one;

    console.log(matrix);
    cols = range(1, matrix[0].length);

    lbVarCoeff = Math.abs(lbVarCoeff);
    for (let i of cols) {
        matrix[lbVarRow][i] = matrix[lbVarRow][i] / lbVarCoeff;
    }
    console.log(matrix);

    for (let i of rows) {
        if (matrix[i][col] != 0) {
            for (let j of range(1, matrix[0].length)) {
                matrix[i][j] = matrix[i][j] + matrix[i][col] * matrix[lbVarRow][j];
            }
            matrix[i][col] = 0;
        }
    }
    console.log(matrix);
    return lbVar;
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
mat = createTableaux(mat);
console.log(mat);
makePivotingStep(mat, 2, 1);
