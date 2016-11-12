const yahoo = require('yahoo-finance');
const moment = require('moment');
const math = require('mathjs');
const models = require('./models.js');
const mc = require('./../montecarlo/index.js');
const thousand = 1000;
const period = 'd';
const one = 1;
const year = 'year';
const format = 'YYYY-MM-DD';
const symbol = 'GOOGL';
const from = 'from';
const to = 'to';
const l1 = 'l1';
const mean = 'mean';
const std = 'std';
/**
 *  @todo: add some external file for literals.
 */


var get_historical = (symbol, dates, period) => {
  // only because of the lodash isPlainObject in yahoo-finance!
  let object = {
    'symbol': symbol,
    'from': dates.from,
    'to': dates.to,
    'period': period
  };
  return yahoo.historical(object);
}

var get_todays = (symbol, fields) => {
  // only because of the lodash isPlainObject in yahoo-finance!
  let object = {
    'symbol': symbol,
    'fields': fields
  };
  return yahoo.snapshot(object);
}

var preprocess = (quotes) => {
  quotes = quotes.map((quote) => quote.adjClose);
  quotes = quotes.map((quote, index) => {
    if (index == 0) {
      return 0;
    }
    // ΔS for 1 day.
    // I have looked around if map provides any spatial object reference (previous/next), couldn't find any.
    // console.log( `quote = ${quote}, quotes[index - 1] = ${quotes[index - 1]}, delta_s = ${(quote - quotes[index - 1]) / quote}`);
    return (quote - quotes[index - 1]) / quote;
  });
  quotes = quotes.slice(one, quotes.length);
  return quotes;
}

var calculate_estimators = (array) => {
  let ret = new Object();
  ret[mean] = math.mean(array);
  ret[std] = math.std(array);
  return ret;
}

var calculate_price = () => {
  let sample_number = thousand;
  let generator = Math.random;
  let estimator_function = intermediate;
  return mc.run(sample_number, generator, estimator_function);
}

var intermediate = (random) => { 
  /** 
   * @todo: these should change, and bind fields, to the whole Object to be, instead of useless function calls.
   */
  let estimators = estimate();
  // console.log(estimators);
  // console.log(price());
  let delta = delta_time();
  // console.log(models.geometric_brownian(estimators, delta, random) * price());
  return models.geometric_brownian(estimators, delta, random) * price();
}

var experiment = () => {
  let dates = new Map();
  dates[to] = moment().format(format);
  dates[from] = moment().subtract(one, year).calendar(null, { sameElse: format });
  let fields = [l1];
  get_todays(symbol, fields).
    then((snapshot) => { module.original_price = snapshot.lastTradePriceOnly }).
    then(() => get_historical(symbol, dates, period)).
    then((quotes) => preprocess(quotes)).
    then((data) => calculate_estimators(data)).
    then((estimators) => { module.estimated = estimators }).
    then((estimators) => calculate_price()).
    then((data => { console.log(data) })).
    catch((error) => console.log(error));
}

/**
 *  just a workaround, in order to keep the simplistic montecarlo implementation.
 */
var module = {
  estimated: 0, // to be set.
  original_price: 0, // to be set.
  price: function () { return this.original_price; },
  estimate: function () { return this.estimated; },
  delta_time: function () { return one; } // one day
};

let estimate = module.estimate.bind(module);
let price = module.price.bind(module);
let delta_time = module.delta_time.bind(module);

// console.log(module.delta_time())
// console.log(calculate_price());

experiment();