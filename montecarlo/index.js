
const classes = require('./../classes.js')
const Payoff = classes.Payoff;
const Point = classes.Pair;

var PD = require("probability-distributions");
var mean = 0;
var sd = 1;

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

function random_point(dimension) {

    if (dimension === null || dimension === undefined) {
        throw "dimension is null, or undefined";
    }
    return new Point(PD.rnorm(dimension, mean, sd));
}

/**
 * @todo: fix discrepancies between d1 && d2 
 */
function d2() {
    let range = 2;
    let start = 0;
    return new Point(Math.random() * range - start, Math.random() * range - start);
}

function d1() {
    let dimension = 1;
    return random_point(dimension);
}


module.exports = {
    d1: d1,
    d2: d2,
    run: run, 
    /**
     *  not sure if it's a good practice.
     */
    Point: Point
}