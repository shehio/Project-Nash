/**
 * μ = sample mean
 * σ = sample volatility
 * Δt = 1 (1 day)
 * φ = normally distributed random number
*/
let geometric_brownian = (estimators, time, random) => 
{
    let miu = estimators.mean;
    let sigma = estimators.std;

    let drift = miu * time;
    let shock = sigma * random * time;
    console.log(`miu = ${miu}, sigma = ${sigma}, drift = ${drift}, shock = ${shock}`);
    let result = drift + shock;
    return result;
};

module.exports = {
    geometric_brownian: geometric_brownian
};