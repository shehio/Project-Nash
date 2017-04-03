const classes = require('./../../classes.js');
const Payoff = classes.Payoff;
const Point = classes.Pair;
const mc = require('./../index.js');
const zero = 0;
const one = 1;
const two = 2;
const thousand = 1000;
function check_inside(point) {
    if (point === undefined || point === null) {
        throw new Error('point is null, or undefined');
    }
    var radius = one;
    var center = new Point(one, one);
    xc = center.x;
    yc = center.y;
    var x = point.x;
    var y = point.y;
    if ((x - xc) * (x - xc) + (y - yc) * (y - yc) < radius * radius) {
        return one;
    }
    return zero;
}

function calculate_radius() {
    let sample_number = 100 * thousand;
    let generator = mc.d2(zero,one,zero,one);
    let estimator_function = check_inside;
    let area_of_square = two * two;
    return mc.run(sample_number, generator, estimator_function) * area_of_square;
}

console.log(calculate_radius());