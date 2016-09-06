
const classes = require('./classes.js')
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

/**
 *  radius example
 */
function random_point(dimension) {
    
    if (dimension === null || dimension === undefined) {
        throw "dimension is null, or undefined";
    }
    return new Point(PD.rnorm(dimension, mean, sd));
}

function d2 (){
    // let dimension = 2;
    // return random_point(dimensions);
    let range = 2;
    let start = 0;
    return new Point(Math.random() * range - start, Math.random() * range - start);
}

function d1 (){
    let dimension = 1;
    return random_point(dimension);
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
    let sample_number = 100000;
    let generator = d2;
    let estimator_function = check_inside;
    let area_of_square = 2 * 2;
    return run(sample_number, generator, estimator_function) * area_of_square;
}

/**
 *  send an object option along with the function name, instead of trivial global variable.
 */
function check_mean(point){
    if(point.x > mean) {
        return true;
    }
    return false;
}


function coin_flip(){
    let sample_number = 100000;
    let generator = d1;
    let estimator_function = check_mean;
    return run(sample_number, generator, estimator_function);
}

/**
 *  @todo: some modularity and clean code!
 */

function coin_flip(){
    let sample_number = 100000;
    let generator = d1; 
    let estimator_function = check_mean;
    return run(sample_number, generator, estimator_function);
}

console.log(coin_flip());

console.log(calculate_radius());
