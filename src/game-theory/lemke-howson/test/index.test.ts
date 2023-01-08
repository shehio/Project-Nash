import { Payoff } from '../../../types'
import { create_tableaux, make_pivoting_step, solve, find_equilibrium } from '../index'
import { normalize_equilibrium } from '../helpers'


describe('create tableaux', () => {
    it('works', () => {
        let expected = [
            [-1, 1, 0, 0, -2, 0],
            [-2, 1, 0, 0, 0, -2],
            [-3, 1, 0, -2, 0, 0],
            [-4, 1, -2, 0, 0, 0]
        ];
        let intermediate = [
            [new Payoff(2, 0), new Payoff(0, 2)],
            [new Payoff(0, 2), new Payoff(2, 0)]
        ];
        let generated = create_tableaux(intermediate);
        expect(generated).toEqual(expected);
    });

    it('works again', () => {
        let expected = [
            [-1,  1,  0,  0,  0, -1, -3,  0],
            [-2,  1,  0,  0,  0,  0,  0, -2],
            [-3,  1,  0,  0,  0, -2, -1, -1],
            [-4,  1, -2, -1,  0,  0,  0,  0],
            [-5,  1, -1, -3,  0,  0,  0,  0],
            [-6,  1,  0, -1, -3,  0,  0,  0]
        ];
        let intermediate = [
            [new Payoff(1, 2), new Payoff(3, 1), new Payoff(0,0)],
            [new Payoff(0, 1), new Payoff(0, 3), new Payoff(2,1)],
            [new Payoff(2, 0), new Payoff(1, 0), new Payoff(1,3)]
        ];
        let generated = create_tableaux(intermediate);
        expect(generated).toEqual(expected);
    });
});

describe(' make pivoting step: ', () => {
    it('works', () => {
        let entering = [
            [-1,  1,  0,  0, -2,  0],
            [-2,  1,  0,  0,  0, -2],
            [-3,  1,  0, -2,  0,  0],
            [-4,  1, -2,  0,  0,  0]
        ];
        let expected_matrix = [
            [-1,    1,    0,    0,   -2,    0],
            [-2,    1,    0,    0,    0,   -2],
            [-3,    1,    0,   -2,    0,    0],
            [ 1,  0.5,    0,    0,    0, -0.5]
        ];

        let eb_var = 1;
        let p1s = 2;
        let expected_lb = -4;

        let actual_lb = make_pivoting_step(entering, p1s, eb_var);
        expect(entering).toEqual(expected_matrix);
        expect(actual_lb).toEqual(expected_lb);
    });
    
     // todo: find a better way to handle percision.
     // todo: Fix spacing below.
    it('works again', () => {
        let entering = [
            [-1, 1, 0, 0, -3, -1],
            [-2, 1, 0, 0, -1, -3],
            [-3, 1, -1, -3, 0, 0],
            [-4, 1, -3, -1, 0, 0]
        ];
        let expected_matrix = [
            [-1, 1, 0, 0, -3, -1],
            [-2, 1, 0, 0, -1, -3],
            [-3, 0.6666666666666667 , 0, -8 / 3, 0 / 1, 1 / 3],
            [1, 1 / 3, 0 / 1, -1 / 3, 0 / 1, -1 / 3]
        ];
        let eb_var = 1;
        let p1s = 2;
        let expected_lb = -4;

        let actual_lb = make_pivoting_step(entering, p1s, eb_var);
        expect(entering).toEqual(expected_matrix);
        expect(actual_lb).toEqual(expected_lb);        
    });

    it("works three times", () => {
        let entering = [
            [-1, 1, 0, 0, -2, 0],
            [-2, 1, 0, 0, 0,-2 ],
            [-3, 1, 0, -2, 0, 0],
            [1, 1/2, 0, 0, 0, -1/2]
        ];
        let expected_matrix = [
            [-1, 1, 0, 0, -2, 0   ],
            [4, 1/2, 0, -1/2, 0, 0],
            [-3, 1, 0, -2, 0, 0   ],
            [1, 1/2, 0, 0, 0, -1/2]
        ];

        let eb_var = 4;
        let p1s = 2;
        let expected_lb = -2;

        let actual = make_pivoting_step(entering, p1s, eb_var);
        expect(entering).toEqual(expected_matrix);
        expect(actual).toEqual(expected_lb);
    });
});

describe(' find equilibrium: ', () => {
    it('works', () => {
        let matrix = [
            [3, 1/3, 0, 0, 0, 0],
            [4, 2/3, 0, 0, 0, 0],
            [1, 3/4, 0, 0, 0, 0],
            [2, 1/4, 0, 0, 0, 0]
        ];
        let expected = [
            [ 0.75, 0.3333333333333333],
            [ 0.25, 0.6666666666666666]
        ];
        let p1s = 2;
        let actual = find_equilibrium(matrix, p1s);
        expect(actual).toEqual(expected);
        
    });

    it('works again', () => {
        let matrix = [
            [5, 3/10, 0, 0, 0, 0],
            [6, 1/2, 0, 0, 0, 0 ],
            [4, 1/10, 0, 0, 0, 0],
            [1, 2/5, 0, 0, 0, 0 ],
            [2, 1/5, 0, 0, 0, 0 ],
            [3, 4/15, 0, 0, 0, 0]
        ];
        let expected = [
            [2/5, 1/10],
            [1/5, 3/10],
            [4/15, 1/2]
        ];
        let p1s = 3;
        let actual = find_equilibrium(matrix, p1s);
        expect(actual).toEqual(expected);  
    });
});

describe(' normalize equilibrium: ', () => {
    it('works', () => {
        let matrix = [
            [2/5, 1/5, 4/15],
            [1/10, 3/10, 1/2]
        ];
        let expected = [
            [0.8, 0.2],
            [0.4, 0.6]
        ];
        let actual = normalize_equilibrium(matrix);
        expect(actual).toEqual(expected);
    });
});

describe(' solve: ', () => {
    it('prisoners dilemma', () => {
        let matrix = [
            [new Payoff(1,1), new Payoff(0, 5)],
            [new Payoff(5, 0), new Payoff(3, 3)]
        ];
        let expected = [
            [0.75, 0.25],
            [0.75, 0.25]
        ];
        let actual = solve(matrix);
        expect(actual).toEqual(expected);
    });

    it('matching pennies', () => {
        let matrix = [
            [new Payoff(1, -1), new Payoff(-1, 1)],
            [new Payoff(-1, 1), new Payoff(1, -1)]
        ];
        let expected = [
            [0.49999999999999994, 0.5000000000000001],
            [0.5000000000000001, 0.49999999999999994]
        ];
        let actual = solve(matrix);
        expect(actual).toEqual(expected);
    });
});