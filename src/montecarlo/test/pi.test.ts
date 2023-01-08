import { Pair as Point } from '../../types'
import { run } from '../index'

const zero = 0;
const one = 1;
const two = 2;
const thousand = 1000;

const generate_2d_point = (xstart, xrange, ystart, yrange) => {
    return () => new Point(Math.random() * xrange + xstart, Math.random() * yrange + ystart);
}

const check_inside_circle = (center, radius, point) => {
    if ((point.x - center.x) ** 2 + (point.y - center.y) ** 2 < radius ** 2) {
        return one;
    }

    return zero;
}

function calculate_pi(sample_number: number = thousand * thousand) {
    let radius = one;
    let center = new Point(zero, zero);
    let area_of_square = two * two;
    
    let generator = generate_2d_point(-one, two, -one, two);
    let estimator_function = (point) => check_inside_circle(center, radius, point);
    return run(sample_number, generator, estimator_function) * area_of_square;
}

describe('Montecarlo pi calculation: ', () => {
    it('convergest with enough sample size', () => {
        const flip = calculate_pi()
        expect(flip).toBeCloseTo(3.14, 2)

    });

    // The test could fail due to random points generation, but unlikely due to small sample size.
    it('does not converge with smaller sample size', () => {
        const flip = calculate_pi(10)
        expect(flip).not.toBeCloseTo(3.14, 2)

    });
});