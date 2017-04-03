var stats = require("simple-statistics");

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

let data = new Array();
let thousand = 1000;
let fifty = 50;

// reformat the data
for(let i = fifty - 1; i > 0 - 1; i--)
{
    data.push(new Array(gdp[i] / thousand, life_expecatncy[i]));
}

// regression
let result = stats.linearRegression(data);
let m = result.m;
let b = result.b;
console.log(result);

// calculate residuals
let average = 0;
let std_error = 0;
let numerator = 0;
let denum = 0;
let residuals = new Array();
let estimated = new Array();

for(let i = 0; i < fifty; i++) 
{
    residuals[i] = (gdp[i] / thousand * m + b - life_expecatncy[i]);
    average += gdp[i] / thousand;
}

average /= fifty;

for(let i = 0; i < fifty; i++) 
{
    numerator += residuals[i] * residuals[i];
    denum += (gdp[i] / thousand - average) * (gdp[i] / thousand - average);
}

numerator /= (fifty - 2);
std_error = Math.sqrt(numerator/denum);

// According to t-table for a two tail test with confidence level 99.9%
// t should be around 3.5, we have it at 22 which means we are beyond
// any doubt
let t = (m - 0) / std_error;
console.log(`standard error = ${std_error}`);
console.log(`t = ${t}`);
console.log("We reject the null hypothesis, and accept the alternative hypothesis.");
console.log("Link to t-table: http://www.sjsu.edu/faculty/gerstman/StatPrimer/t-table.pdf")