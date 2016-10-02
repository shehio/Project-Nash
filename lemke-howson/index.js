const classes = require('./../classes.js');
const Payoff = classes.Payoff;
const Pair = classes.Pair;
const Node = classes.Node;
const zero = 0;
const one = 1;
const two = 2;

/**
 *  @todo: move this to a separate file.
 */
function range(start, stop, step) {
    if (arguments.length == 0) {
        throw new Error('range function must have at least one arguement.')
    }
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
 *  @todo: embed methods to prevent user directly access x, and y (fields) [Design of API].
 * FYI, can overflow.
 */
function normalize_matrices(matrix) {
    if (!matrix || !matrix instanceof Array) {
        throw new Error('matrix is null, or not an array');
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
    if (min <= 0) {
        min = - min + 1;
    }
    else {
        return matrix;
    }
    let ret = new Array();
    for (let i = 0; i < matrix.length; i++) {
        let arr = new Array();
        for (let j = 0; j < matrix[i].length; ++j) {
            arr.push(new Payoff(matrix[i][j].x + min, matrix[i][j].y + min));
        }
        ret.push(arr);
    }
    return ret;
}

function create_tableaux(matrix) {
    if (!matrix || !matrix instanceof Array) {
        throw new Error("matrix is null, or not an array.");
    }
    if (matrix.length == 0) {
        throw new Error("matrix is empty.");
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
            // avoiding negative zeros, that's failing the tests.
            if (matrix[i][j].y == 0) {
                tableaux[i + p1s][j + two] = 0;
            }
            else {
                tableaux[i + p1s][j + two] = - matrix[i][j].y;
            }
            if (matrix[i][j].x == 0) {
                tableaux[i][j + two + p2s] = 0;
            }
            else {
                tableaux[i][j + two + p2s] = - matrix[i][j].x;
            }
        }
    }
    return tableaux;

}

// 2 cols, and -1 to transfer eb_var from 1-based to 0-based
var var_to_col = (x) => Math.abs(x) + 2 - 1;

function get_row_nums(x, p1s, matrix) {
    if (-p1s <= x < 0 || x > p1s) {
        return range(0, p1s);
    }
    //if it's negative and less, or positive and less. or equals.
    else {
        return range(p1s, matrix.length);
    }
}

/**
 *  @todo: change this to return the modified matrix as well!
 *  Remember immutability.
 */
function make_pivoting_step(matrix, p1s, eb_var) {
    // if entering var is more or equal zero, or the entering is more than the rows.
    if (Math.abs(eb_var) <= 0 || Math.abs(eb_var) > matrix.length) {
        throw ('Selected variable index is invalid.');
    }
    // if player's one strategies are less than zero, or player's  one strategies are more than the rows
    if (p1s < 0 || matrix.length <= p1s) {
        throw ('Invalid number of strategies for player 1.');
    }

    let lb_var = 0;
    let min = Infinity;
    let rows = get_row_nums(eb_var, p1s, matrix);
    let col = var_to_col(eb_var);
    let lb_varCoeff = 0;
    for (let i of rows) {
        if (matrix[i][col] < 0) {
            let ratio = -matrix[i][1] / matrix[i][col];
            if (min > ratio) {
                min = ratio;
                lb_var = matrix[i][0];
                lb_var_row = i;
                lb_varCoeff = matrix[i][col];
            }
        }
    }

    matrix[lb_var_row][zero] = eb_var;
    matrix[lb_var_row][var_to_col(eb_var)] = zero;
    matrix[lb_var_row][var_to_col(lb_var)] = -one;

    // console.log(matrix);
    cols = range(1, matrix[0].length);

    lb_varCoeff = Math.abs(lb_varCoeff);
    for (let i of cols) {
        matrix[lb_var_row][i] = matrix[lb_var_row][i] / lb_varCoeff;
    }
    // console.log(matrix);

    for (let i of rows) {
        if (matrix[i][col] != 0) {
            for (let j of range(1, matrix[0].length)) {
                matrix[i][j] = matrix[i][j] + matrix[i][col] * matrix[lb_var_row][j];
            }
            matrix[i][col] = 0;
        }
    }
    // console.log(matrix);
    return lb_var;
}

/**
 *  @todo: go through the code and figure the one-based zero-based inconsistency.
 */
function find_equilibrium(matrix, p1s) {
    if (p1s < zero || matrix.length <= p1s) {
        throw ('Invalid number of strategies for player 1.');
    }
    first_column_numbers = new Array();
    for (let i of range(zero, matrix.length, one)) {
        first_column_numbers.push(Math.abs(matrix[i][zero]));
    }
    for (let i of range(zero, matrix.length, one)) {
        if (!(i in first_column_numbers)) {
            throw ('Invalid indices in the first column of the tableaux.')
        }
    }
    let eqs = new Array();
    for (let i of range(zero, matrix.length, one)) {
        let strategy = Math.abs(matrix[i][zero]);
        let probability = matrix[i][one];
        // normalizing for zero based again
        if (strategy < 0 || probability < 0) {
            eqs[strategy - one] = 0;
        }
        else {
            eqs[strategy - one] = probability;
        }
    }

    /**
     *  subset and concat vertically.
     *  @todo: move it to a separate function.
     */

    let a = eqs.slice(zero, p1s);
    let b = eqs.slice(p1s, eqs.length);
    let c = a.map(function (element, i) {
        let arr = new Array();
        arr.push(element);
        // concat or push
        return arr.concat(b[i]);
    });

    return c;
}


function normalize(arr) {
    if (typeof arr === 'undefined') {
        throw 'Array is undefined.'
    }
    let norm = 0;
    for (let i of arr) {
        norm = norm + i;
    }
    let ret = new Array();
    for (let i of arr) {
        ret.push(i / norm);
    }
    return ret;
}

function normalize_equilibrium(matrix) {
    if (typeof matrix === 'undefined') {
        throw 'matrix has to be defined.'
    }
    let types = new Array(typeof matrix[zero], typeof matrix[one]);
    if ('undefined' in types) {
        throw 'matrix has empty probabilities.'
    }
    for (arr of matrix) {
        for (element of arr) {
            if (typeof element === 'number') {
                continue;
            }
            throw 'matrix has non number probabilities.'
        }
    }
    var ret = new Array();
    ret.push(normalize(matrix[zero]));
    ret.push(normalize(matrix[one]));
    return ret;
}
function matching_pennies() {
    var matrix = new Array();
    var arr = [new Payoff(1, -1), new Payoff(-1, 1)];
    matrix.push(arr);
    arr = [new Payoff(-1, 1), new Payoff(1, -1)];
    matrix.push(arr);
    return matrix;
}


function solve(matrix) {
    // player's one strategies are the matrix rows.
    let p1s = matrix.length;
    let init_basis_var = one;
    let compare = 0;
    // console.log(matrix);
    // console.log('-----------------------------');
    matrix = normalize_matrices(matrix);
    // console.log(matrix[0]);
    // console.log('-----------------------------');
    // console.log(matrix[1]);
    matrix = create_tableaux(matrix);
    // console.log(matrix);
    let left_basis_var = make_pivoting_step(matrix, p1s, init_basis_var);
    while (compare != init_basis_var) {
        left_basis_var = make_pivoting_step(matrix, p1s, -left_basis_var);
        compare = Math.abs(left_basis_var);
    }
    matrix = find_equilibrium(matrix);
    matrix = normalize_equilibrium(matrix);
    return matrix;
}

// var matrix = matching_pennies();
// matrix = solve(matrix);
// console.log(matrix);

var prisoners_dilemma = function () {
    var matrix = new Array();
    var arr = [new Payoff(-1, -1), new Payoff(-10, 0)];
    matrix.push(arr);
    arr = [new Payoff(0, -10), new Payoff(-5, -5)];
    matrix.push(arr);
    return matrix;
}

// var matrix = prisoners_dilemma();
// matrix = solve(matrix);
// console.log(matrix);

module.exports = {
    solve: solve,
    range: range,
    normalize_matrices: normalize_matrices,
    create_tableaux: create_tableaux,
    make_pivoting_step: make_pivoting_step
}