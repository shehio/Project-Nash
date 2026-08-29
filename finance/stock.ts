import { historical, snapshot  } from 'yahoo-finance'
import { mean, std  } from 'mathjs'
import { run  } from './../src/montecarlo/index'
import { geometric_brownian, standard_normal  } from './models'

const one = 1
const thousand = 1000

export class StockHelper {
  static getHisoricalPrices(symbol, dates, period) {
    let input = {
      'symbol': symbol,
      'from': dates.from,
      'to': dates.to,
      'period': period
    };

    return historical(input);
  }

  static getPriceToday(symbol, fields) {
    let input = {
      'symbol': symbol,
      'fields': fields
    };

    return snapshot(input);
  }

  static calculateArithmaticReturnsForAdjClose(quotes) {
    quotes = quotes.map((quote) => quote.adjClose);
    quotes = quotes.map((quote, index) => {
      if (index === 0) {
        return 0;
      }

      return (quote - quotes[index - 1]) / quotes[index - 1];
    });

    quotes = quotes.slice(one, quotes.length);
    return quotes;
  }

  // run() calls the estimator with a single argument, so the price, the
  // estimators and the horizon are closed over instead of being passed through.
  static calculate_price(price, estimators, time, sample_size?)
 {
    if (sample_size == undefined)
    {
      sample_size = thousand;
    }

    let generator = standard_normal;
    let estimator_function = (random) => price * Math.exp(geometric_brownian(estimators, time, random));
    return run(sample_size, generator, estimator_function);
  }

  static getStats(samples)
  {
    let stats = {};
    stats['mean'] = mean(samples);
    stats['std'] = std(samples);
    return stats;
  }

  // _estimateUsingGBM(random)
  // { 
  //   let estimators = estimate();
  //   let delta = delta_time();
  //   return geometric_brownian(estimators, delta, random) * price();
  // }
}