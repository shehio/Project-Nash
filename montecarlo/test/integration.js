/**
 *  This file tries to integrate a random function, as the integration of a function is merely the area under the curve.
 *  As done in calculating pi, we drop random points, and find the ratio of points that were really under the curve over
 *  the total points, and by multiplying it to an already known area, we thus get the area under the curve.
 */
const mc = require('./../index.js');
const math = require('mathjs');
const thousand = 1000;
const zero = 0;
/**
 *  Assumptions: functions are increasing on positive domain/range.
 */
var check_inside = (fx) => {
    return (point) => point.y < fx(point.x);
}
/**
 *  @param: eval_string
 *  @param: x
 *  return: 
 */
var f = (eval_string, x) => math.eval(eval_string, { x: x });

/**
 *  @param: eval_string
 *  @param: x
 *  return: 
 */
var y = (fx) => { return (x) => f(fx, x) };

/**
 *  We chose to work on definite integral for any increasing function, and on any positive domain/range for now.
 *  @todo: add non increasing support by getting the maximum of a function => differentiate.
 *  @param: start
 *  @param: end
 *  @param: fx
 *  throw: 
 */
function calculate_area(start, end, fx) {
    if (arguments.length < 3) {
        throw 'please provide start, end, and function for integration.'
    }
    fx = y(fx);
    let sample_number = 10 * thousand;
    let xrange = end - start;
    let max = fx(end)
    let generator = mc.d2(start, xrange, zero, max);
    let estimator_function = check_inside(fx);
    let area_of_square = (end - start) * max;
    return mc.run(sample_number, generator, estimator_function) * area_of_square;
}

console.log(calculate_area(0, 1, 'e ^ x'));
console.log(calculate_area(0, Math.PI, 'cos(x) * cos(x)'));
console.log(calculate_area(1, 2, '2 * x + 3 * x * x * x'));

module.exports = {
    calculate_area: calculate_area
}