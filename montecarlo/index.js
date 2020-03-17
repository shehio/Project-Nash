const Point = require('./../classes.js').Pair;

let PD = require("probability-distributions");
let mean = 0;
let sd = 1;

function run(sample_number, probability_distribution, estimator_function) 
{
    let miu = 0;

    for (let i = 0; i < sample_number; i++) {
        miu = miu + estimator_function(probability_distribution());
    }

    return miu / sample_number;
}

function random_point(dimension) 
{
    if (dimension === null || dimension === undefined) 
    {
        throw "dimension is null, or undefined";
    }
    return new Point(PD.rnorm(dimension, mean, sd));
}

/**
 * definitely broke something while changing it.
 */
function d2(xstart, xrange, ystart, yrange) 
{
    return () => new Point(Math.random() * xrange + xstart, Math.random() * yrange + ystart);
}

function d1()
{
    let dimension = 1;
    return random_point(dimension);
}


module.exports = {
    d1: d1,
    d2: d2,
    run: run
};