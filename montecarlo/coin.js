const mc = require('./index.js');

var mean = 0;
/**
 *  @todo: some modularity and clean code!
 */
/**
 *  send an object option along with the function name, instead of trivial global variable.
 */

function coin_flip(){
    let sample_number = 100000;
    let generator = mc.d1; 
    let estimator_function = check_mean;
    return mc.run(sample_number, generator, estimator_function);
}


function check_mean(point){
    if(point.x > mean) {
        return true;
    }
    return false;
}

console.log(coin_flip());