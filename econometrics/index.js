const stats = require('simple-statistics');
const regression = require('regression');
const data_storage = require('./../data/index.js');

// Data from WorldBank
let gdp_percapita = data_storage.make_request(['usa'], 'NY.GDP.PCAP.CD', 1960, 2010)[0].slice(1);
let life_expecatncy = data_storage.make_request(['usa'], 'SP.DYN.LE00.IN', 1960, 2010)[0].slice(1);

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

    console.log(result);
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

// white's test for heteroskedasticity:

// û = αo + α1 ŷ + α2 ŷ ^ 2
// regress û on ŷ and ŷ squared.
// this is a multiregression problem which can't be dealt with using linear regression.
// it can also just be considered polynomial regression of degree two (makes things easier)

// û (pronunced u circumflex) is merely the difference between the actual 
// value and the estimator (regressed value) using the aforedescribed OLS.
// we've already got it: residuals array.

var white = function (x, m, b, residuals)
{
    let y = [];
    let n = x.length;
    for(let i = 0; i < n; i++)
    {   
        y.push(m * x[i] + b);
    }

    return F_test_with_significance(y, residuals);
}

// F test ~ extend it to take any type of regression, and evalution methods as arguments
// and number of parameters accordingly
var F_test_with_significance = function (x, y)
{
    let n = x.length;
    let observation = [];
    let data = [];
    
    for(let i = 0; i < n; i++)
    {   
        observation = [];
        observation.push(x[i]);
        observation.push(y[i]);
        data.push(observation);
    }

    result = regression('polynomial', data, 2);
    let coeff = result.equation;
    console.log(coeff);


    // now we test the significance of the regression:
    // Ho: αo = α1 = α2 = 0, 
    // Ha: αj ≠ 0, ∃ j
    // we are going to use the F-test (ANOVA)
    // Fo = MSr/MSe, MSr: regression mean square, while MSe: error mean square.

    // The total variability of the observed data, i.e. the total sum of squares can be accounted for 
    // using of the variability explained by the model , and the portion unexplained by the model
    // SSt = SSr + SSe

    // The above equation is also referred to as the analysis of variance identity and can be expanded as follows:  
    // Σ(yi - ȳ) ^ 2 = Σ(ŷi - ȳ) ^ 2 + Σ(yi - ŷ) ^ 2

    // MSr = SSr /  d.f, where d.f = n (data points) + regressors - 1
    // MSe = SSe / d.f, where d.f = n (data points) + regressors - 1

    // To cut a long story short: calculate the F statistic, and then there is a look-up table.

    let y_hat = [];
    let alpha_node = coeff[0], alpha_one = coeff[1], alpha_two = coeff[2];
    let regressor = 0;
    let y_bar = 0;

    for(let i = 0; i < n; i++)
    {
        regressor = x[i];
        y_hat.push(alpha_node + alpha_one * regressor + alpha_two * regressor * regressor);
        y_bar += y[i];
    }

    y_bar /= n;

    let SSR = 0;
    let SSE  = 0;
    let SST = 0;

    for(let i = 0; i < n; i++)
    {
        SSR += (y_hat[i] - y_bar) * (y_hat[i] - y_bar);
        SSE += (y[i] - y_hat[i]) * (y[i] - y_hat[i]);
        SST += (y[i] - y_bar) * (y[i] - y_bar);
    }

    // n is the number of observations, p is the number of regression parameters
    let p = 2;
    // or DFR 
    let DFM = p - 1 
    // degrees of freedom of the error 
    let DFE = n - p 
    // total degrees of freedom
    let DFT = n - 1

    // or MSM 
    let MSR = SSR / DFM;

    let MSE = SSE / DFE;
    let MST = SST / DFT;
    let f = MSR/MSE;
    return f;
}

// According to t-table for a two tail test with confidence level 99.9%
// t should be around 3.5, we have it at 22 which means we are beyond
// any doubt
let thousand = 1000;
let ret = regression_significance(gdp_percapita.map((x) => x / thousand), life_expecatncy, 0);
console.log(`t = ${ret.t}`);
console.log("We reject the null hypothesis, and accept the alternative hypothesis.");
console.log("Link to t-table: http://www.sjsu.edu/faculty/gerstman/StatPrimer/t-table.pdf");

let f = white(gdp_percapita.map((x) => x / thousand), ret.m, ret.b, ret.residuals)

if(f > 62)
{
    console.log(f);

    // by far
    console.log('we reject the null of homoskedasticity, and accept the alternative hypothesis');
}


