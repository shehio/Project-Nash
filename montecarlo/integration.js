/**
 *  This file tries to integrate a random function, as the integration of a function is merely the area under the curve.
 *  As done in calculating pi, we drop random points, and find the ratio of points that were really under the curve over
 *  the total points, and by multiplying it to an already known area, we thus get the area under the curve.
 */

const mc = require('./index.js');

/**
 *  For starters, let's work on y = x
 *  Assumptions: function starts at x = 0
 *  
 */
function check_inside(order) {
    return (point) => point.y < Math.pow(point.x, order);
}

function f(x, order) {
    return Math.pow(x, order);
}

/**
 *  We chose to work on definite integral for any polynomial, and on any positive range for now.
 * 
 */

function calculate_area(start, end, order) {
    let sample_number = 10000;
    let square_below = (end - start) * f(start, order);
    /**
     *  normalize the interval
     */
    end = end - start;
    start = 0;
    let xrange = end - start;
    let yrange = Math.pow(end, order) - Math.pow(start, order);
    let generator = mc.d2(start, xrange, Math.pow(start, order), yrange);
    let estimator_function = check_inside(order);
    let area_of_square = (end - start) * Math.pow(end, order);
    return square_below + mc.run(sample_number, generator, estimator_function) * area_of_square;
}


console.log(calculate_area(1, 2, 1));
console.log(calculate_area(2, 5, 1));
console.log(calculate_area(0, 3, 3));

module.exports = {

}