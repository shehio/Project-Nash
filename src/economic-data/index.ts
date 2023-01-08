
import request from 'sync-request'

const base = 'http://api.worldbank.org/';
const literals = ['countries/', 'indicators/', 'date=', '&format=json'];

const concatenate = function(array) {
    let ret = '';
    let i = 0;

    for(; i < array.length - 1; i++){
        ret = ret + array[i] + ';';        
    }

    return ret  + array[i];
}

const format_dates = function(start_date, end_date) {
    return start_date + ':' + end_date;
}

export function create_request(countries: any, start_date: any, end_date: any, indicator: any) {
    let countries_string = concatenate(countries);
    let dates = format_dates(start_date, end_date);

    let address = base + literals[0] + countries_string + '/' + literals[1] +
        indicator + '?' + literals[2] + dates + literals[3];
    return address;
}

// Accept many countries, indicators, and years, and returns a matrix of the data
// returned values are sorted by countries ordered by date
// API limitation: we can't request too many indicators at a time, only one.
export const make_request = function(address) {   
    let response = request('GET', address);
    response  = JSON.parse(response.getBody('utf8'));
    console.log(response)
    response = response[1];
    return response
}

export const parse_response = function(response, countries) {
    countries = countries.sort();

    // todo: Change this!
    const response_length = (response as unknown as []).length
    
    let div = response_length / countries.length;
    let ret = [];

    for (let i = 0; i < countries.length; i++) {   
        ret[i] = []
    }

    for (let i = 0; i < response_length; i++) {
        let element = response[i];
        ret[Math.floor(i/div)].push(parseFloat(element.value))
    }

    for (let i = 0; i < countries.length; i++) {   
        ret[i].reverse();
        ret[i].unshift(countries[i])
    }

    return ret;
}

const countries = ['usa', 'chn', 'bra']
const start_date = 2000
const end_date = 2010
const indicator = 'NY.GDP.PCAP.CD'

let address = create_request(countries, start_date, end_date, indicator)
let response = make_request(address)
let parsed = parse_response(response, countries)

console.log(parsed)

// http://api.worldbank.org/countries/usa/indicators/NY.GDP.PCAP.CD?date=1960:2010&format=json