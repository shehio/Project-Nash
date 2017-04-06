const stats = require('simple-statistics');
const regression = require('regression');

// let's begin with the simplist hypothesis, Gauss–Markov assumption are satistfied,
// i.e. OLS is BLUE, we will have to perform an OLS just before a t-test

// Data from WorldBank

// Ho: β1 = 0, Ha: β1 ≠ 0
let life_expecatncy = 
[
78.390243902439,
78.0390243902439,
77.9878048780488,
77.6878048780488,
77.4878048780488,
77.4878048780488,
77.0365853658537,
76.9365853658537,
76.8365853658537,
76.6365853658537,
76.5829268292683,
76.5804878048781,
76.4292682926829,
76.0268292682927,
75.6219512195122,
75.619512195122,
75.419512195122,
75.6170731707317,
75.3658536585366,
75.2146341463415,
75.0170731707317,
74.7658536585366,
74.7658536585366,
74.6146341463415,
74.5634146341464,
74.5634146341464,
74.4634146341463,
74.3609756097561,
74.009756097561,
73.609756097561,
73.8048780487805,
73.3560975609756,
73.2560975609756,
72.8560975609756,
72.6048780487805,
71.9560975609756,
71.3560975609756,
71.1560975609756,
71.1073170731707,
70.8073170731707,
70.5073170731708,
69.9512195121951,
70.5609756097561,
70.2121951219512,
70.2146341463415,
70.1658536585366,
69.9170731707317,
70.119512195122,
70.2707317073171,
69.7707317073171
];
let gdp = 
[
47001.5,
48401.4,
48061.5,
46437.0,
44307.9,
41921.8,
39677.1,
38166.0,
37273.6,
36449.8,
34620.9,
32949.1,
31572.6,
30068.2,
28782.1,
27776.6,
26464.8,
25492.9,
24405.1,
23954.4,
22922.4,
21483.2,
20100.8,
19115.0,
18269.4,
17134.2,
15561.4,
14438.9,
13993.1,
12597.6,
11695.5,
10587.2,
9471.3,
8611.4,
7820.0,
7242.4,
6741.3,
6109.9,
5623.4,
5246.8,
5032.1,
4695.9,
4336.4,
4146.3,
3827.5,
3573.9,
3374.5,
3243.8,
3066.5,
3007.1
];


// t-test: significance of linear regression, 
// searched a lot for something ready, didn't find any for regression.
// simple-statistics has a traditional t-test (one way and two ways).
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


// According to t-table for a two tail test with confidence level 99.9%
// t should be around 3.5, we have it at 22 which means we are beyond
// any doubt
let thousand = 1000;
let ret = regression_significance(gdp.map((x) => x / thousand), life_expecatncy, 0);
console.log(`t = ${ret.t}`);
console.log("We reject the null hypothesis, and accept the alternative hypothesis.");
console.log("Link to t-table: http://www.sjsu.edu/faculty/gerstman/StatPrimer/t-table.pdf")

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

// change format of the data to be compliant with regression.js
var white = function (x, m, b, residuals)
{
    let awry = [];
    let y_hat = [];
    let y_bar = 0;
    let data = [];
    let n = residuals.length;

    for(let i = 0; i < n; i++)
    {   
        y_hat.push(m * x[i] + b);
        y_bar += y_hat[i];

        awry.push(y_hat[i]);
        awry.push(residuals[i]);

        data.push(awry);
        awry = [];
    }

    result = regression('polynomial', data, 2);

    y_bar /= n;
    let coeff = result.equation;
    console.log(coeff);


    // *******************
    // Create an ANOVA method starting here!

    // now we test the significance of the regression, 
    // Ho: αo = α1 = α2 = 0, 
    // Ha: αj ≠ 0, ∃ j
    // we are going to use the F-test (ANOVA)
    // Fo = MSr/MSe, MSr: regression mean square, while MSe: error mean square.

    // The total variability of the observed data, i.e. the total sum of squares can be accounted for 
    // using of the variability explained by the model , and the portion unexplained by the model
    // SSt = SSr + SSe

    // The above equation is also referred to as the analysis of variance identity and can be expanded as follows:  
    // Σ(yi - ȳ) ^ 2 = Σ(ŷi - ȳ) ^ 2 + Σ(yi - ŷ) ^ 2
    // y is just a symbol for a standard eqn, what we are looking for here is u.

    // MSr = SSr /  d.f, where d.f = n (data points) + regressors - 1
    // MSe = SSe / d.f, where d.f = n (data points) + regressors - 1

    // To cut a long story short: calculate the F statistic, and then there is a look-up table.


    // we've got ui ~ observation, we lack ui circumflex, and u bar
    // ui is the residuals, ui hat is the residuals of the estimators of the residuals.
    // u bar is just the average

    let u_hat = [];
    let alpha_node = coeff[0];
    let alpha_one = coeff[1];
    let alpha_two = coeff[2];
    let regressor = 0;
    let u_bar = 0;

    for(let i = 0; i < n; i++)
    {
        regressor = y_hat[i];
        u_hat.push(alpha_node + alpha_one * regressor + alpha_two * regressor * regressor);
        u_bar += residuals[i];
    }

    u_bar /= n;

    // change notattion to make it easy again:
    x = y_hat;
    let x_bar = y_bar;
    y = y_hat;
    y_hat = u_hat;
    y_bar = u_bar;
    
    let SSR = 0;
    let SSE  = 0;
    let SST = 0;
    let df = n - 1;

    for(let i = 0; i < n; i++)
    {
        SSR += (y_hat[i] - y_bar) * (y_hat[i] - y_bar);
        SSE += (y[i] - y_hat[i]) * (y[i] - y_hat[i]);
        SST += (y[i] - y_bar);
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
    let f = MSR/MSE;

    return f;
}

console.log(white(gdp.map((x) => x / thousand), ret.m, ret.b, ret.residuals));

