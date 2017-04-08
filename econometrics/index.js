const data_storage = require('./../data/index.js');
const stats = require('simple-statistics');

// let's begin with the simplist hypothesis, Gauss–Markov assumption are satistfied,
// i.e. OLS is BLUE, we will have to perform an OLS just before a t-test

// t-test: significance of linear regression, 
// Ho: β1 = 0, Ha: β1 ≠ 0
// searched a lot for something ready, didn't find any for regression.
// simple-statistics has a traditional t-test (one way and two ways).

// mu is the population's 
var regression_significance = function (x, y, mu = 0)
{
    let data = [];
    let average = 0;
    let std_error = 0;
    let numerator = 0;
    let denum = 0;
    let residuals = [];
    let estimated = [];
    let n = x.length;
    let t = 0;

    // reformat the data
    for(let i = 0; i < n; i++)
    {
        data.push(new Array(x[i], y[i]));
    }

    // regression
    let result = stats.linearRegression(data);
    let m = result.m;
    let b = result.b;
    
    // calculate residuals
    for(let i = 0; i < n; i++) 
    {
        residuals[i] = ( x[i] * m + b - y[i]);
        average += x[i];
    }

    average /= n;

    for(let i = 0; i < n; i++) 
    {
        numerator += residuals[i] * residuals[i];
        denum += (x[i] - average) * (x[i] - average);
    }

    numerator /= (n - 2);
    std_error = Math.sqrt(numerator/denum);
    t = (m - mu) / std_error;

    return {
        b: b, 
        m: m, 
        residuals: residuals,
        std_error: std_error, 
        t: t
    };
}

// now we have to figure out whether OLS is really BLUE or not, i.e.whether
// it satistfies the Gauss–Markov assumptions.
// Tests are provided in the subsequent files.

var quick_test = function () 
{    
    // Data from WorldBank
    let gdp_percapita = data_storage.make_request(['usa'], 'NY.GDP.PCAP.CD', 1960, 2010)[0].slice(1);
    let life_expecatncy = data_storage.make_request(['usa'], 'SP.DYN.LE00.IN', 1960, 2010)[0].slice(1);
    let thousand = 1000;
    let ret = regression_significance(gdp_percapita.map((x) => x / thousand), life_expecatncy, 0);

    // According to t-table for a two tail test with confidence level 99.9%
    // t should be around 3.5, we have it at 22 which means we are beyond
    // any doubt

    console.log(`t = ${ret.t}`);
    console.log("We reject the null hypothesis, and accept the alternative hypothesis.");
    console.log("Link to t-table: http://www.sjsu.edu/faculty/gerstman/StatPrimer/t-table.pdf");
}

/**
 * 
 * 
 * 
 *  TEST the f-test with a linear regression!
 *  Add unit tests!
 * 
 * 
 * 
 * 
 */

module.exports  = {
    regression_significance: regression_significance
}