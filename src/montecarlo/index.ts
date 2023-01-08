const Point = require('../types.ts').Pair;

let PD = require("probability-distributions");
let mean = 0;
let sd = 1;

const random_point = (dimension) => {
    if (dimension === null || dimension === undefined) {
        throw "dimension is null, or undefined";
    }
    return new Point(PD.rnorm(dimension, mean, sd));
}

export const d2 = (xstart, xrange, ystart, yrange) => {
    return () => new Point(Math.random() * xrange + xstart, Math.random() * yrange + ystart);
}

export const d1 = () => {
    let dimension = 1;
    return random_point(dimension);
}

export const run = (sample_number, probability_distribution, estimator_function) => {
    let miu = 0;

    for (let i = 0; i < sample_number; i++) {
        miu = miu + estimator_function(probability_distribution());
    }

    return miu / sample_number;
}