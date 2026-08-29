import { geometric_brownian, standard_normal } from '../models'
import { StockHelper } from '../stock'

const sample = (generator, size) => {
    let samples = [];
    for (let i = 0; i < size; i++) {
        samples.push(generator());
    }

    return samples;
};

describe('standard_normal: ', () =>
{
    it('has mean zero and unit variance', () =>
    {
        let samples = sample(standard_normal, 200000);
        let stats = StockHelper.getStats(samples);

        expect(stats['mean']).toBeCloseTo(0, 1);
        expect(stats['std']).toBeCloseTo(1, 1);
    });

    // Math.random is uniform on [0, 1), so the shock could only ever be positive.
    it('produces negative draws', () =>
    {
        let samples = sample(standard_normal, 1000);

        expect(samples.filter((draw) => draw < 0).length).toBeGreaterThan(300);
    });
});

describe('geometric_brownian: ', () =>
{
    let estimators = { mean: 0.1, std: 0.4 };

    it('applies the ito correction to the drift', () =>
    {
        // With no shock the log return is (mu - sigma^2 / 2) * time.
        let time = 2;
        let expected = (0.1 - 0.4 * 0.4 / 2) * time;

        expect(geometric_brownian(estimators, time, 0)).toBeCloseTo(expected, 10);
    });

    it('scales the shock by the square root of time', () =>
    {
        // Doubling the horizon must scale the shock by sqrt(2), not by 2.
        let drift_one = geometric_brownian(estimators, 1, 0);
        let drift_two = geometric_brownian(estimators, 2, 0);

        let shock_one = geometric_brownian(estimators, 1, 1) - drift_one;
        let shock_two = geometric_brownian(estimators, 2, 1) - drift_two;

        expect(shock_two / shock_one).toBeCloseTo(Math.sqrt(2), 10);
    });
});

describe('StockHelper.calculate_price: ', () =>
{
    let price = 100;
    let estimators = { mean: 0.08, std: 0.25 };
    let time = 2;

    it('converges to the analytical mean of the lognormal price', () =>
    {
        // E[S_T] = S_0 * exp(mu * T)
        let expected = price * Math.exp(estimators.mean * time);
        let estimated = StockHelper.calculate_price(price, estimators, time, 400000);

        expect(estimated).not.toBeNaN();
        expect(estimated / expected).toBeCloseTo(1, 1);
    });

    it('defaults the sample size and stays finite', () =>
    {
        let estimated = StockHelper.calculate_price(price, estimators, time);

        expect(Number.isFinite(estimated)).toBe(true);
        expect(estimated).toBeGreaterThan(0);
    });
});
