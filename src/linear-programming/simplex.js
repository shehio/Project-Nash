var n = 0;
var m = 0;
var last_row = 0;
var last_col = 0;

const zero = 0;

/**
 *  n (rows) = constraints + objective function.
 *  m (cols) = non basic variables (length of any array in A) + basic variables (represented by the number of constraints) + p (represented by the objective function)
 */
/**
 *  @todo: handle the exceptions that could arise from inputs.
 *  @todo: handle if no constraints: if A is empty, this is going to throw, and exception.
 */
function matrix(A, b, cT) 
{
    if (A.length != b.length)
    {
        return [];
    }

    n = A.length + 1;
    m = A[0].length + n;
    last_row = n - 1;
    last_col = m;

    let zeros = [];

    for (let i = 0; i < n; i++) 
    {
        zeros.push(0);
    }

    let objective = cT.map((coefficient) => -coefficient);

    let ret = [];
    let i = 0;

    // for a deep copy
    for (; i < A.length; i++)
    {
        let arr = zeros.concat();
        let basic = arr.slice(0, i).
            concat([1]).
            concat(arr.slice(i + 1, n));
        ret.push(A[i].concat(basic).concat(b[i]));
    }

    ret.push(objective.concat(zeros.slice(0, i)).concat([1]).concat([0]));

    return ret;
}

function check(matrix)
{
    for (let i = 0; i < last_col; i++)
    {
        if (matrix[last_row][i] < zero) 
        {
            return false;
        }
    }
    return true;
}

function pivot(matrix) 
{
    let min = Infinity;
    let index = 0;
    for (let i = 0; i < last_col; i++)
    {
        if (matrix[last_row][i] < min) 
        {
            index = i;
            min = matrix[last_row][i];
        }
    }
    return index;
}

/**
 *  Returns -1 when the pivot column holds no positive entry: nothing bounds the
 *  entering variable, so the linear program is unbounded.
 */
function pick_row(matrix, col)
{
    let ratio = Infinity;
    let index = -1;

    for (let i = 0; i < n - 1; i++)
    {
        if (matrix[i][col] <= 0)
        {
            continue;
        }

        let current_ratio = matrix[i][last_col] / matrix[i][col];
        if (current_ratio < ratio) 
        {
            index = i;
            ratio = current_ratio;
        }
    }

    return index;
}
function scale_row(matrix, row, col) 
{
    let scale = matrix[row][col];
    for (let i = 0; i <= m; i++) 
    {
        matrix[row][i] /= scale;
    }
}

function scale_matrix(matrix, row, col) 
{
    for (let i = 0; i < n; i++) 
    {
        if (i != row) 
        {
            let ratio = matrix[i][col] / matrix[row][col];
            for (let j = 0; j <= m; j++) 
            {
                matrix[i][j] -= matrix[row][j] * ratio;
            }
        }
    }
}

function simplex(matrix)
{
    while (!check(matrix))
    {
        let col = pivot(matrix);
        let row = pick_row(matrix, col);

        if (row === -1)
        {
            throw new Error('The linear program is unbounded.');
        }

        scale_row(matrix, row, col);
        scale_matrix(matrix, row, col);
    }

    return matrix;
}

module.exports = { matrix, simplex };

/**
 * Example according to: https://people.richland.edu/james/ictcm/2006/simplex.html
 */
if (require.main === module)
{
    let cT = new Array(40, 30);
    let A = [];
    A.push(new Array(1, 2));
    A.push(new Array(1, 1));
    A.push(new Array(3, 2));
    let b = new Array(16, 9, 24);

    console.log(simplex(matrix(A, b, cT)));
}
