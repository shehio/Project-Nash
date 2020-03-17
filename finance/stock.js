const yahoo = require('yahoo-finance');
const math = require('mathjs');
const models = require('./models.js');
const mc = require('./../montecarlo/index.js');

class StockHelper
{
  static getHisoricalPrices(symbol, dates, period)
  {
    let input = {
      'symbol': symbol,
      'from': dates.from,
      'to': dates.to,
      'period': period
    };

    return yahoo.historical(input);
  }

  static getPriceToday(symbol, fields)
  {
    let input = 
    {
      'symbol': symbol,
      'fields': fields
    };

    return yahoo.snapshot(input);
  }

  static calculateArithmaticReturnsForAdjClose(quotes)
  {
    quotes = quotes.map((quote) => quote.adjClose);
    quotes = quotes.map((quote, index) => 
    {
      if (index === 0) 
      {
        return 0;
      }

      return (quote - quotes[index - 1]) / quote;
    });

    quotes = quotes.slice(one, quotes.length);
    return quotes;
  }

  static calculate_price(sample_size)
  {
    if (sample_size == undefined)
    {
      sample_size = thousand;
    }

    let generator = Math.random;
    let estimator_function = _estimate_gbm;
    return mc.run(sample_size, generator, estimator_function);
  }

  static getStats(samples)
  {
    let stats = {};
    stats['mean'] = math.mean(samples);
    stats['std'] = math.std(samples);
    return stats;
  }

  _estimateUsingGBM(random)
  { 
    let estimators = estimate();
    let delta = delta_time();
    return models.geometric_brownian(estimators, delta, random) * price();
  }
}

module.exports = {
  StockHelper: StockHelper
}