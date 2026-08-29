/**
 * μ = sample mean (drift per unit time)
 * σ = sample volatility (per √(unit time))
 * Δt = time step
 * φ = standard normal random number
 *
 * Log return over Δt: (μ - σ² / 2)Δt + σ√(Δt)φ
 * so that S(t + Δt) = S(t) * exp(log return) and E[S(t + Δt)] = S(t) * exp(μΔt).
*/
export const geometric_brownian = (estimators, time, random) => {
    let miu = estimators.mean;
    let sigma = estimators.std;

    let drift = (miu - (sigma * sigma) / 2) * time;
    let shock = sigma * Math.sqrt(time) * random;
    let result = drift + shock;
    return result;
};

/**
 * Box-Muller transform: turns two uniforms on (0, 1) into a standard normal.
 * Math.random alone is uniform on [0, 1) and would only ever shock the price up.
*/
export const standard_normal = () => {
    let u = 0;
    let v = 0;
    while (u === 0) { u = Math.random(); }
    while (v === 0) { v = Math.random(); }
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
