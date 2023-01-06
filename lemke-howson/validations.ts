const zero = 0;
const one = 1;

export function validated_array(arr) {
    if (typeof arr === 'undefined') {
        throw new Error('Array is undefined.');
    }
}

export function validate_matrix(matrix) {
    if (typeof matrix === 'undefined') {
        throw new Error('Matrix is undefined.');
    }

    let types = new Array(typeof matrix[zero], typeof matrix[one]);

    if ('undefined' in types) {
        throw new Error('Matrix has empty probabilities.');
    }

    for (let arr of matrix) {
        // Also, add a 0 < n < 1 check?
        for (let element of arr) {
            if (typeof element === 'number') {
                continue;
            }

            throw new Error('Matrix has probabilities that are not numbers.');
        }
    }
}

export function validate_input(matrix, p1_strategies_count) {
    if (p1_strategies_count < zero) 
    {
        throw ('Invalid number of strategies for player 1.');
    }

    if (matrix.length <= p1_strategies_count)
    {
        throw ('Provided payoff matrix is less than the number of strategies for player 1.');
    }
}

export function validate_tableaux(tableaux, eb_var, p1_strategies_count) {
    // If entering var is more or equal zero, or the entering is more than the rows.
    if (Math.abs(eb_var) <= 0 || Math.abs(eb_var) > tableaux.length) {
        throw ('Selected variable index is invalid.');
    }

    // If player's one strategies are less than zero, or player's  one strategies are more than the rows.
    if (p1_strategies_count < 0 || tableaux.length <= p1_strategies_count) {
        throw ('Invalid number of strategies for player 1.');
    }
}