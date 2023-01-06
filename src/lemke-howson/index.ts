import { normalize_equilibrium, range, normalize_matrices } from './helpers'
import { validate_input, validate_tableaux } from './validations'

const zero = 0;
const one = 1;
const two = 2;

export function solve(game) {
    let p1_strategies_count = game.length;

    game = normalize_matrices(game);
    let tableaux = create_tableaux(game);

    p1_strategies_count = game.length
    find_left_basis(tableaux, p1_strategies_count)
    
    let equilibrium = find_equilibrium(tableaux, p1_strategies_count);
    
    return normalize_equilibrium(equilibrium);
}

export function create_tableaux(game) {
    if (game.length === 0) {
        throw new Error("game is empty.");
    }

    let p1_strategies_count = game.length;
    let p2_strategies_count = game[0].length;
    let strategies = p1_strategies_count + p2_strategies_count;

    // The tableaux should be s x s+2 matrix.
    const tableaux = new Array(strategies).fill(0).map(() => new Array(strategies + 2).fill(0));

    // Index every column by it's negative index.
    for (let i = 0; i < tableaux.length; i++) {
        tableaux[i][zero] = - (i + 1);
    }
    
    // Second column should all be ones.
    for (let i = 0; i < tableaux.length; i++) {
        tableaux[i][one] = one;
    }   

    for (let i = 0; i < game.length; i++) {
        for (let j = 0; j < game[0].length; j++) {
                if (game[i][j].y != 0) {
                    tableaux[j + p1_strategies_count][i + two] = - game[i][j].y;
                }

                if (game[i][j].x != 0) {
                    tableaux[i][j + p1_strategies_count + two] = - game[i][j].x;
                }
        }
    }

    return tableaux;
}

function find_left_basis(matrix, p1_strategies_count) {
    let init_basis_var = one;
    let left_basis_var = zero;
    
    left_basis_var = make_pivoting_step(matrix, p1_strategies_count, init_basis_var);

    while (init_basis_var != Math.abs(left_basis_var))
    {
        left_basis_var = make_pivoting_step(matrix, p1_strategies_count, -left_basis_var);
    }
}

export function make_pivoting_step(tableaux, p1_strategies_count, eb_var) {
    validate_tableaux(tableaux, eb_var, p1_strategies_count);

    let lb_var = 0, lb_var_row = 0, lb_varCoeff = 0;
    let cols = [];
    let min = Infinity;
    let rows = get_row_nums(eb_var, p1_strategies_count, tableaux);
    let col = var_to_col(eb_var);

    for (let i of rows) {
        if (tableaux[i][col] < 0) {
            let ratio = - tableaux[i][1] / tableaux[i][col];
            if (min > ratio) {
                min = ratio;
                lb_var = tableaux[i][0];
                lb_var_row = i;
                lb_varCoeff = tableaux[i][col];
            }
        }
    }

    tableaux[lb_var_row][zero] = eb_var;
    tableaux[lb_var_row][var_to_col(eb_var)] = zero;
    tableaux[lb_var_row][var_to_col(lb_var)] = -one;

    cols = range(1, tableaux[0].length);
    lb_varCoeff = Math.abs(lb_varCoeff);

    for (let i of cols) {
        tableaux[lb_var_row][i] = tableaux[lb_var_row][i] / lb_varCoeff;
    }

    for (let i of rows) {
        if (tableaux[i][col] !== 0) {
            for (let j of range(1, tableaux[0].length)) 
            {
                tableaux[i][j] = tableaux[i][j] + tableaux[i][col] * tableaux[lb_var_row][j];
            }
            tableaux[i][col] = 0;
        }
    }

    return lb_var;
}

export function find_equilibrium(tableaux, p1_strategies_count) {
    validate_input(tableaux, p1_strategies_count);

    let first_column_numbers = [];

    for (let i = 0; i < tableaux.length; i++) {
        first_column_numbers.push(Math.abs(tableaux[i][zero]));
    }
    
    let eqs = [];
    for (let i = 0; i < tableaux.length; i++) {
        let strategy = Math.abs(tableaux[i][zero]);
        let probability = tableaux[i][one];

        if (strategy < 0 || probability < 0) {
            eqs[Math.abs(strategy) - one] = 0;
        } else {
            eqs[Math.abs(strategy) - one] = probability;
        }
    }

    /**
     *  subset and concat vertically.
     *  todo: move it to a separate function.
     */
    let a = eqs.slice(zero, p1_strategies_count);
    let b = eqs.slice(p1_strategies_count, eqs.length);
    let c = a.map(function (element, i) {
        let arr = [];
        arr.push(element);
        return arr.concat(b[i]);
    });
    return c;
}

// 2 cols, and -1 to transfer eb_var from 1-based to 0-based
var var_to_col = (x) => Math.abs(x) + 2 - 1;

export function get_row_nums(x, p1_strategies_count, matrix) {
    if ((-p1_strategies_count <= x && x < 0) || x > p1_strategies_count) {
        return range(0, p1_strategies_count);
    } else {
        // If it's negative and less, or positive and less. or equals.
        return range(p1_strategies_count, matrix.length);
    }
}