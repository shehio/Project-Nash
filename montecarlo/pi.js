const mc = require('./index.js');

function check_inside(point) {
    if (point === undefined || point === null) {
        throw "point is null, or undefined";
    }
    var radius = 1;
    var center = new mc.Point(1, 1);
    xc = center.x;
    yc = center.y;
    var x = point.x;
    var y = point.y;
    if ((x - xc) * (x - xc) + (y - yc) * (y - yc) < radius * radius) {
        return 1;
    }
    return 0;
}

function calculate_radius(){
    let sample_number = 100000;
    let generator = mc.d2;
    let estimator_function = check_inside;
    let area_of_square = 2 * 2;
    return mc.run(sample_number, generator, estimator_function) * area_of_square;
}

console.log(calculate_radius());