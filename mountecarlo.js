
const classes = require('./classes.js')
const Payoff = classes.Payoff;
const Point = classes.Pair;

var PD = require("probability-distributions");
function run(sample_number, probability_distribution, estimator_function) {
    var n = sample_number;
    var p = probability_distribution;
    var f = estimator_function;

    var miu = 0;
    var data = new Array();

    for (let i = 0; i < n; i++) {
        miu = miu + f(p());
    }
    miu = miu / n;
    return miu;
}

/**
 *  radius example
 */

/**
 *  normal distribution.
 *  @todo: change it.
 */
function random_point() {
    var dimension = 2;
    if (dimension === null || dimension === undefined) {
        throw "dimension is null, or undefined";
    }
    let mean = 1;
    let sd = 0.57;
    return new Point(PD.rnorm(dimension, mean, sd));
}

function check_inside(point) {
    if (point === undefined || point === null) {
        throw "point is null, or undefined";
    }
    var radius = 1;
    var center = new Point(1, 1);
    xc = center.x;
    yc = center.y;
    var x = point.x;
    var y = point.y;
    if ((x - xc) * (x - xc) + (y - yc) * (y - yc) < radius * radius) {
        return 1;
    }
    return 0;
}

function calculate_radius(){
    var sample_number = 100000;
    var generator = random_point;
    var estimator_function = check_inside;
    var area_of_square = 2 * 2;
    return run(sample_number, generator, estimator_function) * area_of_square;
}

console.log(calculate_radius());