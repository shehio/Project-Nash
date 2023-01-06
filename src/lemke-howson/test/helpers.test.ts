import { Payoff } from '../../types'
import { range, normalize_matrices } from '../helpers'

const zero = 0;

describe('range: ', () => 
{
    it('default step equals one', () => 
    {
        let expected = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let generated = range(1, 10);
        expect(generated).toEqual(expected);
        
    });

    it('generates numbers accordingly', () => 
    {
        let expected = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let generated = range(1, 10, 1);
        expect(generated).toEqual(expected);
        
    });
});

describe('normalize matrix: ', () => 
{
    // it('throws an error on non array arguements', () => 
    // {
    //     assert.throws(function () { normalize_matrices(zero); }, Error, 'matrix is null, or not an array.');
        
    // });

    let positive = () => { return new Array(new Payoff(1, 1), new Payoff(1, 1), new Payoff(1, 1)); };
    let negative = () => { return new Array(new Payoff(-1, -1), new Payoff(-1, -1), new Payoff(-1, -1)); };
    let zeros = () => { return new Array(new Payoff(0, 0), new Payoff(0, 0), new Payoff(0, 0)); };

    let generate_matrix = (generator) => 
    {
        let matrix =
            [
                [new Payoff(1, 1), new Payoff(2, 2), new Payoff(3, 3)],
                generator(),
                [new Payoff(4, 4), new Payoff(5, 5), new Payoff(6, 6)]
            ];
        return matrix;
    };

    let generate_expected_matrix = (start, i) => 
    {
        let matrix =
            [
                [new Payoff(1 + i, 1 + i), new Payoff(2 + i, 2 + i), new Payoff(3 + i, 3 + i)],
                [new Payoff(start + i, start + i), new Payoff(start + i, start + i), new Payoff(start + i, start + i)],
                [new Payoff(4 + i, 4 + i), new Payoff(5 + i, 5 + i), new Payoff(6 + i, 6 + i)]
            ];
        return matrix;
    };

    it('works with zero', () => 
    {
        let expected = generate_expected_matrix(0, 1);
        let generated = normalize_matrices(generate_matrix(zeros));
        expect(generated).toEqual(expected);
        
    });

    it('works with negative numbers', () => 
    {
        let expected = generate_expected_matrix(-1, 2);
        let generated = normalize_matrices(generate_matrix(negative));
        expect(generated).toEqual(expected);
        
    });

    it('works with positive numbers', () => 
    {
        let expected = generate_expected_matrix(1, 0);
        let generated = normalize_matrices(generate_matrix(positive));
        expect(generated).toEqual(expected);
        
    });
});