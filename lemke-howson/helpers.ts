import { validated_array, validate_matrix } from './validations'

const zero = 0;
const one = 1;

/**
 *  Add the absolute value of lowest element to all elements.
*/
export function normalize_matrices(matrix) {    
    let min = find_minimum(matrix)
    
    if (min > 0) { return matrix }

    min = - min + 1;
    let ret = [];

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; ++j) {
            matrix[i][j].x += min
            matrix[i][j].y += min
        }
    }

    return matrix;
}

export function normalize_equilibrium(matrix) {
    validate_matrix(matrix)

    var p1_probabilities = [];
    var p2_probabilities = [];

    for(let i = 0; i < matrix.length; ++i) {
        p1_probabilities.push(matrix[i][zero]);
        p2_probabilities.push(matrix[i][one]);
    }

    return [normalize(p1_probabilities), normalize(p2_probabilities)];
}

function find_minimum(matrix) {
    let min = Infinity;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; ++j) {
            min = Math.min(matrix[i][j].x, matrix[i][j].y, min);
        }
    }

    return min
}

function normalize(arr) {
    validated_array(arr)

    let norm = 0;
    let ret = [];

    for (let i of arr) { norm = norm + i }
    for (let i of arr) { ret.push(i / norm); }

    return ret;
}

/**
* returns an array of (stop - start) / step numbers
* from the start to the stop with moving one step at a time.
*
* @todo: move this to a separate file.
*/
export function range(start, stop, step = 1): number[] {
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
}

    let result = [];
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
}
