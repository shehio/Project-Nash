"use strict";
exports.__esModule = true;
exports.parse_response = exports.make_request = exports.create_request = void 0;
var sync_request_1 = require("sync-request");
var base = 'http://api.worldbank.org/';
var literals = ['countries/', 'indicators/', 'date=', '&format=json'];
var concatenate = function (array) {
    var ret = '';
    var i = 0;
    for (; i < array.length - 1; i++) {
        ret = ret + array[i] + ';';
    }
    return ret + array[i];
};
var format_dates = function (start_date, end_date) {
    return start_date + ':' + end_date;
};
function create_request(countries, start_date, end_date, indicator) {
    var countries_string = concatenate(countries);
    var dates = format_dates(start_date, end_date);
    var address = base + literals[0] + countries_string + '/' + literals[1] +
        indicator + '?' + literals[2] + dates + literals[3];
    return address;
}
exports.create_request = create_request;
// Accept many countries, indicators, and years, and returns a matrix of the data
// returned values are sorted by countries ordered by date
// API limitation: we can't request too many indicators at a time, only one.
var make_request = function (address) {
    var response = (0, sync_request_1["default"])('GET', address);
    response = JSON.parse(response.getBody('utf8'));
    console.log(response);
    response = response[1];
    return response;
};
exports.make_request = make_request;
var parse_response = function (response, countries) {
    countries = countries.sort();
    var response_length = response.length;
    var div = response_length / countries.length;
    var ret = [];
    for (var i = 0; i < countries.length; i++) {
        ret[i] = [];
    }
    for (var i = 0; i < response_length; i++) {
        var element = response[i];
        ret[Math.floor(i / div)].push(parseFloat(element.value));
    }
    for (var i = 0; i < countries.length; i++) {
        ret[i].reverse();
        ret[i].unshift(countries[i]);
    }
    return ret;
};
exports.parse_response = parse_response;
var countries = ['usa', 'chn', 'bra'];
var start_date = 2000;
var end_date = 2010;
var indicator = 'NY.GDP.PCAP.CD';
var address = create_request(countries, start_date, end_date, indicator);
var response = (0, exports.make_request)(address);
var parsed = (0, exports.parse_response)(response, countries);
console.log(parsed);
// http://api.worldbank.org/countries/usa/indicators/NY.GDP.PCAP.CD?date=1960:2010&format=json
