import { Payoff } from '../src/types'

const zero = 0;
const one = 1;

export function normalize_equilibrium(matrix) {
    if (typeof matrix === 'undefined') {
        throw new Error('Matrix is undefined.');
    }

    let types = new Array(typeof matrix[zero], typeof matrix[one]);
    
    if ('undefined' in types) {
        throw new Error('Matrix has empty probabilities.');
    }

    for (let arr of matrix) {
        // Also, add a 0 < n < 1 check?
        for (let element of arr) 
        {
            if (typeof element === 'number') 
            {
                continue;
            }

            throw new Error('Matrix has probabilities that are not numbers.');
        }
    }

    var ret = [];
    var p1A = [];
    var p2A = [];

    // Transposing n * 2 matrix
    for(let i = 0; i < matrix.length; ++i) {
        p1A.push(matrix[i][zero]);
        p2A.push(matrix[i][one]);
    }

    ret.push(normalize(p1A));
    ret.push(normalize(p2A));
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



/**
*  @todo: embed methods to prevent user directly access x, and y (fields) [Design of API].
*  FYI, can overflow.
*/
export function normalize_matrices(matrix) {    
    // find the lowest element
    let min = Infinity;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; ++j)
        {
            min = Math.min(matrix[i][j].x, matrix[i][j].y, min);
        }
    }
    
    if (min > 0) {
        return matrix;
    }

    min = - min + 1;
    let ret = [];

    for (let i = 0; i < matrix.length; i++) {
        let arr = [];

        for (let j = 0; j < matrix[i].length; ++j) {
            arr.push(new Payoff(matrix[i][j].x + min, matrix[i][j].y + min));
        }

        ret.push(arr);
    }

    return ret;
}

export function normalize(arr) {
    if (typeof arr === 'undefined') 
    {
        throw new Error('Array is undefined.');
    }

    let norm = 0;

    for (let i of arr) {
        norm = norm + i;
    }

    let ret = [];

    for (let i of arr) {
        ret.push(i / norm);
    }

    return ret;
}