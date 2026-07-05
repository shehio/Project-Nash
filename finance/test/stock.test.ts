import { StockHelper } from '../stock'

describe('StockHelper: ', () =>
{
    it('calculates arithmetic returns from adjusted close prices', () =>
    {
        let quotes = [
            { adjClose: 100 },
            { adjClose: 110 },
            { adjClose: 99 }
        ];

        let returns = StockHelper.calculateArithmaticReturnsForAdjClose(quotes);

        expect(returns.length).toEqual(2);
        expect(returns[0]).toBeCloseTo(0.1, 10);
        expect(returns[1]).toBeCloseTo(-0.1, 10);
    });

    it('calculates mean and standard deviation of samples', () =>
    {
        let stats = StockHelper.getStats([2, 4, 4, 4, 5, 5, 7, 9]);

        expect(stats['mean']).toEqual(5);
        expect(stats['std']).toBeCloseTo(Math.sqrt(32 / 7), 10);
    });
});
