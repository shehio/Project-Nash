const regression = require('regression');

// white's test for heteroskedasticity:
// û ^ 2 = αo + α1 ŷ + α2 ŷ ^ 2
// regress the SQUARED residuals on ŷ and ŷ squared.
// this is a multiregression problem which can't be dealt with using linear regression.
// it can also just be considered polynomial regression of degree two (makes things easier)

// û (pronunced u circumflex) is merely the difference between the actual 
// value and the estimator (regressed value) using the aforedescribed OLS.
// we've already got it: residuals array.

// The auxiliary regression has to explain the *variance* of the errors, so its
// dependent variable is û ^ 2. Regressing û itself has no power at all: OLS
// residuals are orthogonal to the fitted values by construction, so the slope
// is zero whether the errors are homoskedastic or not.

var white = function (x, m, b, residuals)
{
    let y = [];
    let squared_residuals = [];
    let n = x.length;
    for(let i = 0; i < n; i++)
    {   
        y.push(m * x[i] + b);
        squared_residuals.push(residuals[i] * residuals[i]);
    }

    return lm_test_with_significance(y, squared_residuals);
}

// LM test ~ extend it to take any type of regression, and evalution methods as arguments
// and number of parameters accordingly
var lm_test_with_significance = function (x, y)
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

    // now we test the significance of the auxiliary regression:
    // Ho: α1 = α2 = 0 (homoskedasticity),
    // Ha: αj ≠ 0, ∃ j

    // The total variability of the observed data, i.e. the total sum of squares can be accounted for 
    // using of the variability explained by the model , and the portion unexplained by the model
    // SSt = SSr + SSe

    // The above equation is also referred to as the analysis of variance identity and can be expanded as follows:  
    // Σ(yi - ȳ) ^ 2 = Σ(ŷi - ȳ) ^ 2 + Σ(yi - ŷ) ^ 2

    // White's statistic is the Lagrange multiplier LM = n * R ^ 2, where
    // R ^ 2 = SSr / SSt for the auxiliary regression. Under the null it is
    // chi-squared with as many degrees of freedom as there are regressors in
    // that auxiliary regression: 2 here (ŷ and ŷ squared), so the 5% critical
    // value is 5.991.

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
    let SST = 0;

    for(let i = 0; i < n; i++)
    {
        SSR += (y_hat[i] - y_bar) * (y_hat[i] - y_bar);
        SST += (y[i] - y_bar) * (y[i] - y_bar);
    }

    return n * (SSR / SST);
}

var quick_test = function () 
{
    // Required here rather than at the top: the module fires an HTTP request on load.
    const data_storage = require('./../src/economic-data/index.js');
    const econ = require('./index.js');

    let thousand = 1000;

    // Data from WorldBank
    let gdp_percapita = data_storage.make_request(['usa'], 'NY.GDP.PCAP.CD', 1960, 2010)[0].slice(1);
    let life_expecatncy = data_storage.make_request(['usa'], 'SP.DYN.LE00.IN', 1960, 2010)[0].slice(1);

    let ret = econ.regression_significance(gdp_percapita.map((x) => x / thousand), life_expecatncy, 0);
    let lm = white(gdp_percapita.map((x) => x / thousand), ret.m, ret.b, ret.residuals)

    // chi-squared with 2 degrees of freedom, 5% critical value
    if(lm > 5.991)
    {
        console.log(lm);

        // by far
        console.log('we reject the null of homoskedasticity, and accept the alternative hypothesis');
    }
}


module.exports = {
    white: white
}
