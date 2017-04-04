'use strict;';
const request = require('sync-request');
const path = require('path');

const base = 'http://api.worldbank.org/';
literals = ['countries/', 'indicators/', 'date=', '&format=json'];

// accept many countries, indicators, and years, and returns a 3d array of the data
var make_request = function(countries, indicators, start_date, end_date)
{
    countries = concatenate(countries);
    indicators = concatenate(indicators);
    dates = format_dates(start_date, end_date);
    let address = base + literals[0] + countries + '/' + literals[1] + indicators + '?' + literals[2] + dates + literals[3];
    let response = request('GET', address);
    response  = JSON.parse(response.getBody('utf8'));
    console.log(response);

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

make_request(['usa', 'chn'], ['NY.GDP.PCAP.CD'], 2000, 2001);

// http://api.worldbank.org/countries/usa/indicators/NY.GDP.PCAP.CD?date=1960:2010&format=json