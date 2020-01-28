const classes = require('./../classes.js');
const helpers = require('./helpers.js');
const Payoff = classes.Payoff;
const zero = 0;
const one = 1;
const two = 2;

function solve(matrix) 
{
    let p1s = matrix.length;

    matrix = helpers.normalize_matrices(matrix);
    matrix = create_tableaux(matrix);
    
    matrix = find_equilibrium(matrix, p1s);
    matrix = helpers.normalize_equilibrium(matrix);
    return matrix;
}

function find_equilibrium(matrix, p1s) 
{
    validate_input(matrix, p1s);
    find_left_basis(matrix, p1s);

    first_column_numbers = [];

    for (let i of helpers.range(zero, matrix.length, one)) 
    {
        first_column_numbers.push(Math.abs(matrix[i][zero]));
    }

    for (let i of helpers.range(zero, matrix.length, one)) 
    {
        if (!(i in first_column_numbers)) 
        {
            throw new Error('Invalid indices in the first column of the tableaux.');
        }
    }
    
    let eqs = [];
    for (let i of helpers.range(zero, matrix.length, one)) 
    {
        let strategy = Math.abs(matrix[i][zero]);
        let probability = matrix[i][one];

        // Normalizing for zero based again.
        if (strategy < 0 || probability < 0) 
        {
            eqs[strategy - one] = 0;
        }
        else 
        {
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
        let arr = [];
        arr.push(element);
        return arr.concat(b[i]);
    });
    return c;
}

function create_tableaux(matrix)
{
    if (!matrix) 
    {
        throw new Error("matrix is null");
    }

    if (matrix.length === 0) 
    {
        throw new Error("matrix is empty.");
    }

    let p1s = matrix.length;
    let p2s = matrix[0].length;
    let strategies = p1s + p2s;

    // Should have an (s) by (s + 2) matrix
    let tableaux = new Array(strategies);
    
    // initialize every row: an array of (S+2) zeros
    for (let i = 0; i < tableaux.length; i++) 
    {
        tableaux[i] = Array.apply(null, Array(strategies + 2)).map(Number.prototype.valueOf, 0);
    }

    // indexing every column by it's negative index
    for (let i = 0; i < tableaux.length; i++) 
    {
        tableaux[i][zero] = - (i + 1);
    }
    
    // second column should all be ones
    for (let i = 0; i < tableaux.length; i++) 
    {
        tableaux[i][one] = one;
    }

    for (let i = 0; i < matrix.length; i++) 
    {
        for (let j = 0; j < matrix[0].length; j++) 
        {
            // avoiding negative zeros, it was failing the tests.
            if (matrix[i][j].y === 0) 
            {
                tableaux[j + p1s][i + two] = 0;
            }
            else
            {
                tableaux[j + p1s][i + two] = - matrix[i][j].y;
            }

            if (matrix[i][j].x === 0) 
            {
                tableaux[i][j + two + p1s] = 0;
            }
            else 
            {
                tableaux[i][j + two + p1s] = - matrix[i][j].x;
            }
        }
    }
    return tableaux;

}

// 2 cols, and -1 to transfer eb_var from 1-based to 0-based
var var_to_col = (x) => Math.abs(x) + 2 - 1;

function get_row_nums(x, p1s, matrix) 
{
    if (-p1s <= x < 0 || x > p1s) 
    {
        return helpers.range(0, p1s);
    }

    // If it's negative and less, or positive and less. or equals.
    else 
    {
        return helpers.range(p1s, matrix.length);
    }
}

/**
*  @todo: change this to return the modified matrix as well!
*  Remember immutability.
*/
function make_pivoting_step(matrix, p1s, eb_var) 
{
    // If entering var is more or equal zero, or the entering is more than the rows.
    if (Math.abs(eb_var) <= 0 || Math.abs(eb_var) > matrix.length)
    {
        throw ('Selected variable index is invalid.');
    }

    // If player's one strategies are less than zero, or player's  one strategies are more than the rows.
    if (p1s < 0 || matrix.length <= p1s) 
    {
        throw ('Invalid number of strategies for player 1.');
    }

    let lb_var = 0;
    let min = Infinity;
    let rows = get_row_nums(eb_var, p1s, matrix);
    let col = var_to_col(eb_var);
    let lb_varCoeff = 0;

    for (let i of rows)
    {
        if (matrix[i][col] < 0) 
        {
            let ratio = -matrix[i][1] / matrix[i][col];
            if (min > ratio) 
            {
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

    cols = helpers.range(1, matrix[0].length);
    lb_varCoeff = Math.abs(lb_varCoeff);

    for (let i of cols) 
    {
        matrix[lb_var_row][i] = matrix[lb_var_row][i] / lb_varCoeff;
    }

    for (let i of rows) 
    {
        if (matrix[i][col] !== 0) 
        {
            for (let j of helpers.range(1, matrix[0].length)) 
            {
                matrix[i][j] = matrix[i][j] + matrix[i][col] * matrix[lb_var_row][j];
            }
            matrix[i][col] = 0;
        }
    }

    return lb_var;
}

function validate_input(matrix, p1s)
{
    if (p1s < zero) 
    {
        throw ('Invalid number of strategies for player 1.');
    }

    if (matrix.length <= p1s)
    {
        throw ('Provided payoff matrix is less than the number of strategies for player 1.');
    }
}

function find_left_basis(matrix, p1s)
{
    let init_basis_var = one;
    let left_basis_var = 0;
    
    left_basis_var = make_pivoting_step(matrix, p1s, init_basis_var);

    while (init_basis_var != Math.abs(left_basis_var))
    {
        left_basis_var = make_pivoting_step(matrix, p1s, -left_basis_var);
    }
}

function matching_pennies() 
{
    var matrix = [];
    var arr = [new Payoff(1, -1), new Payoff(-1, 1)];
    matrix.push(arr);
    arr = [new Payoff(-1, 1), new Payoff(1, -1)];
    matrix.push(arr);
    return matrix;
}

module.exports = {
    solve: solve
};

// should be coppied to tests!
let matrix = matching_pennies();
matrix = solve(matrix);
console.log(matrix);

matrix = 
        [
            [new Payoff(1,1)]
        ];
console.log(solve(matrix));

matrix = 
    [
    [new Payoff(1,2),new Payoff(3,1),new Payoff(0,0) ],
    [new Payoff(0,1),new Payoff(0,3),new Payoff(2,1)],
    [new Payoff(2,0), new Payoff(1,0), new Payoff(1,3)]
    ];
console.log(solve(matrix));

var prisoners_dilemma = function () 
{
    var matrix = [];
    var arr = [new Payoff(-1, -1), new Payoff(-10, 0)];
    matrix.push(arr);
    arr = [new Payoff(0, -10), new Payoff(-5, -5)];
    matrix.push(arr);
    return matrix;
};

console.log(solve(prisoners_dilemma()));