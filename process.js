var fs = require('fs');
var moment = require('moment');

var data = fs.readFileSync('src/_data/RideAustin_Weather.csv')
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()) // remove white spaces for each line
    .map(e => e.split(',').map(e => e.trim())); // split each line to array

dataColumns = data.splice(0,1)[0];
console.log(moment(data[0][dataColumns.indexOf('completed_on')],"MM/DD/YY HH:SS"));
