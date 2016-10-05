let geometric_brownian =  (probability, time, random) => {
    let miu = probability.mean;
    let sigma = probability.std_deviation;

    let drift = miu * time;
    let shock = sigma * random * time;

    let result = drift + shock;
    return shock;
}

module.exports = {
    geometric_brownian: geometric_brownian
}