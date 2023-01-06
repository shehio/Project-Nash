import { Payoff } from "../../types";
import { check_neighbors, find_pure_strategy_payoff, find_mixed_strategy_payoff  } from "../index";

const prisoners_dilemma = function () {
    let matrix =
        [
            [new Payoff(-1, -1), new Payoff(-10, 0)],
            [new Payoff(0, -10), new Payoff(-5, -5)]
        ];
    return matrix;
};

describe('prisoners dilemma: ', () => {
    let matrix = prisoners_dilemma();

    it('tests check_neighbors', () => {
        let cn = (i, j) => check_neighbors(matrix, i, j);
        expect(cn(0, 0)).toEqual(false);
        expect(cn(0, 1)).toEqual(false);
        expect(cn(1, 0)).toEqual(false);
        expect(cn(1, 1)).toEqual(true);
    });

    it('has a pure nash equilibrium', () => {
        let pure = find_pure_strategy_payoff(matrix);
        expect(pure[0].x).toEqual(1);
        expect(pure[0].y).toEqual(1);
    });
});
