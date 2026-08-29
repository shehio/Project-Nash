const { white } = require('../white.js');
const { regression_significance } = require('../index.js');

// chi-squared with 2 degrees of freedom, 5% critical value
const critical_value = 5.991;

// A seeded generator keeps the statistic reproducible from run to run.
const seeded_normal = (seed) => {
    let state = seed;
    const uniform = () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return (state + 1) / 4294967297;
    };

    return () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform());
};

// y = 2 + 3x + scale(x) * e, so scale controls the error variance.
const build = (observations, scale, seed) => {
    const normal = seeded_normal(seed);
    let x = [];
    let y = [];

    for (let i = 0; i < observations; i++) {
        let point = 1 + (9 * i) / observations;
        x.push(point);
        y.push(2 + 3 * point + scale(point) * normal());
    }

    return { x: x, y: y };
};

const statistic = (data) => {
    let ret = regression_significance(data.x, data.y, 0);
    return white(data.x, ret.m, ret.b, ret.residuals);
};

describe('white test: ', () => {
    it('does not reject a constant error variance', () => {
        let lm = statistic(build(200, () => 1, 12345));

        expect(lm).toBeLessThan(critical_value);
    });

    it('rejects an error variance that grows with the regressor', () => {
        let lm = statistic(build(200, (point) => 0.2 * point * point, 12345));

        expect(lm).toBeGreaterThan(critical_value);
    });
});
