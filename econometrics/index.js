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

// d = Σ (t = 2 to n)  (et - et-1) * (et - et-1) / Σ (t = 1 to n) et ^ 2
// We want to test the hypothesis that et doesn't correlate with et-1
// i.e. tradionally we'd regress on et, and et-1, ie: et = βo + β1 et-1, 
// and then test for the significance of β1 using a t-test, i.e. Ho: β1 = 0, Ha: β1 ≠ 0
// It prevailed that derby watson statistic d = (2 - β1), i.e. an alternative way to test for autocorrelation.

// To test for positive autocorrelation at significance α, the test statistic d is compared to
//  lower and upper critical values (dL,α and dU,α):

// If d < dL,α, there is statistical evidence that the error terms are positively autocorrelated.
// If d > dU,α, there is no statistical evidence that the error terms are positively autocorrelated.
// If dL,α < d < dU,α, the test is inconclusive.
// dl, and du are given in a look-up table mapping number of features and points (observations).

var durbin_watson = function (x, y) 
{
        let ret = regression_significance(x, y, 0);
        let res = ret.residuals;
        let num = 0; 
        let denum  = res[0] * res[0];
        
        // derby-watson statistic 
        let dw = 0;

        for (let i = 1; i < res.length; i++)
        {
            num += (res[i] * res[i-1]) * (res[i] * res[i-1]);
            denum += res[i] * res[i];
        }

        dw = num / denum;
        return dw;
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


// But how do we generate the t-table, or the f-table?
// http://stats.stackexchange.com/questions/72764/how-does-one-generate-the-table-mapping-t-test-values-to-p-values

// cite this as well (used extensively): 
// http://reliawiki.org/index.php/Multiple_Linear_Regression_Analysis
// http://facweb.cs.depaul.edu/sjost/csc423/documents/f-test-reg.htm
// http://reliawiki.org/index.php/Simple_Linear_Regression_Analysis

module.exports  = {
    regression_significance: regression_significance
}