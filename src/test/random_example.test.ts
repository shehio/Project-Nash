import { Payoff } from "../types";
import { check_neighbors, find_pure_strategy_payoff, find_mixed_strategy_payoff  } from "../index";
const rows = 2;
const cols = 2;

var example = function () 
{
    let matrix = 
    [
        [new Payoff(3, -3), new Payoff(-2, 2)],
        [new Payoff(-1, 1), new Payoff(0, 0)]
    ];
    return matrix;
};

describe('random example: ', () => 
{
    let matrix = example();

    it('tests check_neighbors', () => {
        let cn = (i: number, j: number) => check_neighbors(matrix, i, j);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; ++j) {
                expect(cn(i, j)).toEqual(false);
            }
        }
    });

    it('doesnt have a pure nash equilibrium', done => {
        let pure = find_pure_strategy_payoff(matrix);
        expect(pure).toEqual([]);
        done();
    });

    it('has mixed nash equilibrium', () => {
        // @todo: change the extremely error prone decimals, to nearly equal.
        let p1_expected = { p: 0.16666666666666666, average_payoff: 0.33333333333333337 };
        let p2_expected = { p: 0.3333333333333333, average_payoff: -0.3333333333333335 };

        let mixed = find_mixed_strategy_payoff(matrix);

        let p1 = mixed.shift();
        expect(p1).toEqual(p1_expected);

        let p2 = mixed.shift();
        expect(p2).toEqual(p2_expected);
    });
});