import { run, d1 } from '../index'

const mean = 0

const check_mean = (point) => {
    if (point.x > mean) {
        return true;
    }
    return false;
}

const coin_flip = (sample_number: number = 100000) => {
    let generator = d1; 
    let estimator_function = check_mean;
    return run(sample_number, generator, estimator_function);
}

describe('Montecarlo coin flip: ', () => {
    it('convergest with enough sample size', () => {
        const flip = coin_flip()
        expect(flip).toBeCloseTo(0.5, 2)

    });

    it('does not converge with smaller sample size', () => {
        const flip = coin_flip(1)
        expect(flip).not.toBeCloseTo(0.5, 2)

    });
});