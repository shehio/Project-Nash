import { historical, snapshot  } from 'yahoo-finance'
import { mean, std  } from 'mathjs'
import { run  } from './../src/montecarlo/index'
import { geometric_brownian  } from './models'

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
    let estimator_function = geometric_brownian;
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