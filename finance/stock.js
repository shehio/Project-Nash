const yahoo = require('yahoo-finance');
const moment = require('moment');
const math = require('mathjs');
const models = require('./models.js');
const mean = 'mean';
const std = 'std';
const adjClose = 'adjClose';
const thousand = 1000;
const period = 'd';
const one = 1;
const year = 'year';
const format = 'YYYY-MM-DD';
const symbol = 'GOOGL';
const from = 'from';
const to = 'to';
/**
 *  @todo: add some external file for literals.
 */


var get_historical = (symbol, dates, period) => {
  let arguments = new Map();
  // only because of the lodash isPlainObject in yahoo-finance!
  let object = {
    'symbol': symbol,
    'from': dates.from,
    'to': dates.to,
    'period': period
  };
  return yahoo.historical(object);
}
var calculating_probabilities = (historical_data) => {
  // whatever calculate miu, and sigma!
}

var calculate_price = (original_price, probability) => {
  let sample_number = thousand;
  let generator = null; // whatever?
  let estimator_function = models.geometric_brownian;
  return mc.run(sample_number, generator, estimator_function);
}

var preprocess = (quotes) => {
  quotes = quotes.map((quote) => quote.adjClose);
  return quotes;
}

var calculate_estimators = (array) => {
  let ret = new Map().
    set(mean, math.mean(array)).
    set(std, math.std(array));
  return ret;
}
var dates = new Map();
dates[to] = moment().format(format);
dates[from] = moment().subtract(one, year).calendar(null, { sameElse: format });
console.log(dates);
get_historical(symbol, dates, period).
  then((quotes) => preprocess(quotes)).
  then((data) => calculate_estimators(data)).
  then((data => { console.log(data) }));