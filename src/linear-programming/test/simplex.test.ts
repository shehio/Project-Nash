const { matrix, simplex } = require('../simplex.js');

const objective_value = (tableau) => tableau[tableau.length - 1][tableau[0].length - 1];

describe('simplex: ', () => {
    /**
     * Example according to: https://people.richland.edu/james/ictcm/2006/simplex.html
     * Maximize P = 40x + 30y subject to:
     *   x + 2y <= 16
     *   x +  y <= 9
     *  3x + 2y <= 24
     * Optimum: P = 330 at (x, y) = (6, 3).
     */
    it('solves the richland example', () => {
        let cT = [40, 30];
        let A = [[1, 2], [1, 1], [3, 2]];
        let b = [16, 9, 24];

        let tableau = simplex(matrix(A, b, cT));
        expect(objective_value(tableau)).toBeCloseTo(330, 6);
    });

    /**
     * More decision variables than tableau rows. This used to terminate
     * early (returning 20) because the pivot-column search only scanned
     * the first `rows` entries of the objective row.
     */
    it('solves a problem with more variables than constraints', () => {
        // Maximize x + 2y + 3z subject to x + y + z <= 10. Optimum: 30 at z = 10.
        let tableau = simplex(matrix([[1, 1, 1]], [10], [1, 2, 3]));
        expect(objective_value(tableau)).toBeCloseTo(30, 6);
    });

    it('returns an empty matrix when constraints and bounds mismatch', () => {
        expect(matrix([[1, 2]], [16, 9], [40, 30])).toEqual([]);
    });
});
