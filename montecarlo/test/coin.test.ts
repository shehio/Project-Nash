import { run, d1 } from './../index'

const mean = 0

const check_mean = (point) => {
    if (point.x > mean) {
        return true;
    }
    return false;
}

const coin_flip = () => {
    let sample_number = 100000;
    let generator = d1; 
    let estimator_function = check_mean;
    return run(sample_number, generator, estimator_function);
}

console.log(coin_flip());

describe('Montecarlo coin flip: ', () => {
    it('works', () => {
        const flip = coin_flip()
        expect(flip).toBeCloseTo(0.5, 2)

    });
});