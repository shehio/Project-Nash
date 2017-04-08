const stats = require('simple-statistics');

// According to: http://www.statisticshowto.com/goldfeld-quandt-test/
// data can be an array of n (number of observations) arrays where each array of them
// has m numbers (xs, and last one for y)
var GoldfeldQuandt = function (data) 
{
    data = data.sort(Comparator);
    let n = data.length;
    let third = Math.floor(n / 3);
    
    let first_third = [];
    let third_third = [];
    
    for(let i = 0; i < third; i++) 
    {
        first_third.push(data[i]);
        third_third.push(data[2 * third + i]);
    }
    
    // generalize for other regression types, pass the method as an argument
    let first_ret = linear_regression_analysis(first_third);
    let third_ret = linear_regression_analysis(third_third);
    
    let F = (third_ret.RSS / third_ret.n) / (first_ret.RSS / first_ret.n);
    n = third_ret.n + first_ret.n;

    return {
        F: F, 
        n: n
    };
}

// sort on the first item of the array
 function Comparator(a, b) {
   if (a[0] < b[0]) return -1;
   if (a[0] > b[0]) return 1;
   return 0;
 }

var linear_regression_analysis = function (data) 
{ 
    let n = data.length;
    let result = stats.linearRegression(data);
    let m = result.m;
    let b = result.b;

    // residuals sum squared
    let RSS = 0;
    
    for(let i = 0; i < n; i++) 
    {
        RSS += (m * data[i][0] + b  - data[i][1]) * (m * data[i][0] + b  - data[i][1]);
    }

    return {
        b: b, 
        m: m,
        n: n, 
        RSS: RSS
    };
    
}

var quick_test = function () 
{
    let arr = [[0, 1], [1, 2.5], [2, 3], [3, 4], [4, 5], [5, 6.5], [6, 7.75], [7, 8.5], [8, 9], [9, 10]];
    console.log(GoldfeldQuandt(arr));
}
