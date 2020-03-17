'use strict;';
const assert = require('assert');
const expect = require('chai').expect;
var moment = require('moment');
const stockHelper = require('./../stock.js').StockHelper;
const zero = 0;

// @todo: add some external file for literals.
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

describe('range: ', () => 
{
    it('works', (done) => 
    {
        let dates = {};
        dates['to'] = moment().format(format);
        dates['from'] = moment().subtract(one, year).calendar(null, { sameElse: format });
        stockHelper.getHisoricalPrices(symbol, dates, period);
        done();
    });

    // END to END
    
    /// var experiment = () => 
    // {
    // let dates = new Map();
    // dates[to] = moment().format(format);
    // dates[from] = moment().subtract(one, year).calendar(null, { sameElse: format });
    // let fields = [l1];
    // get_todays(symbol, fields).
    //     then((snapshot) => module.original_price = snapshot.lastTradePriceOnly).
    //     then(() => get_historical(symbol, dates, period)).
    //     then((quotes) => preprocess(quotes)).
    //     then((data) => calculate_estimators(data)).
    //     then((estimators) => module.estimated = estimators).
    //     then(() => calculate_price()).
    //     then((data => console.log(data))).
    //     catch((error) => console.log(error));
    // };
});