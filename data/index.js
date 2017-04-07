'use strict;';
const request = require('sync-request');
const path = require('path');

const base = 'http://api.worldbank.org/';
literals = ['countries/', 'indicators/', 'date=', '&format=json'];

// accept many countries, indicators, and years, and returns a matrix of the data
// returned values are sorted by countries ordered by date
// API limitation: we can't request too many indicators at a time, only one.
var make_request = function(countries, indicator, start_date, end_date)
{   
    let countries_string = concatenate(countries);
    let dates = format_dates(start_date, end_date);

    let address = base + literals[0] + countries_string + '/' + literals[1] + 
    indicator + '?' + literals[2] + dates + literals[3];

    let response = request('GET', address);
    response  = JSON.parse(response.getBody('utf8'));
    response = response[1];

    countries = countries.sort();
    let div = response.length / countries.length;
    let ret = [];

    for (let i = 0; i < countries.length; i++) 
    {   
        ret[i] = [];
    }

    for (let i = 0; i < response.length; i++)
    {
        let element = response[i];
        ret[Math.floor(i/div)].push(parseFloat(element.value));
    }

    for (let i = 0; i < countries.length; i++) 
    {   
        ret[i].reverse();
        ret[i].unshift(countries[i]);
    }
    return ret;
}

var concatenate = function(array) 
{
    let ret = '';
    let i = 0;

    for(; i < array.length - 1; i++)
    {
        ret = ret + array[i] + ';';        
    }

    ret  = ret  + array[i];
    return ret;
};

var format_dates = function(start_date, end_date)
{
    return start_date + ':' + end_date;
}

module.exports = 
{
    make_request: make_request
}
// make_request(['usa', 'chn', 'bra'], 'NY.GDP.PCAP.CD', 2000, 2010);

// http://api.worldbank.org/countries/usa/indicators/NY.GDP.PCAP.CD?date=1960:2010&format=json