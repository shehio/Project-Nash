import { Payoff } from "../../types";
import { check_neighbors, find_pure_strategy_payoff, find_mixed_strategy_payoff  } from "../index";

const matching_pennies = function () {
    const matrix = new Array();
    matrix.push([new Payoff(1, -1), new Payoff(-1, 1)]);
    matrix.push([new Payoff(-1, 1), new Payoff(1, -1)]);
    return matrix;
};

describe('matching pennies', () =>
{
    it('tests check_neighbors', () => 
    {
        let matrix = matching_pennies()
        const rows = 2;
        const cols = 2;
        const cn = (i, j) => check_neighbors(matrix, i, j);

        for (let i = 0; i < rows; i++)
        {
            for (let j = 0; j < cols; ++j)
            {
                expect(cn(i, j)).toBe(false);
            }
        }
    });

    it('does not have a pure nash equilibrium', () =>
    {
        let matrix = matching_pennies()
        const pure = find_pure_strategy_payoff(matrix);
        expect(pure).toEqual([]);
    });

    it('has mixed nash equilibrium', () => 
    {
        let matrix = matching_pennies()
        const expected = {p: 0.5, average_payoff: 0};
        const mixed = find_mixed_strategy_payoff(matrix);
        expect(mixed.length).toEqual(2);

        const p1 = mixed.shift();
        expect(p1).toEqual(expected);

        const p2 = mixed.shift();
        expect(p2).toEqual(expected);
    });
});