import PieChart from './graphs/PieChart';
import LineChart from './graphs/LineChart';
import $ from 'jquery';
import _ from 'lodash';
import c3 from 'c3';
import d3 from 'd3';
import Datamap from 'datamaps';
import { queue } from 'd3-queue';


import 'normalize.css/normalize.css';
import 'c3/c3.min.css';
import './stylesheets/main.scss';


// const lineChart = new LineChart( document.getElementById('linechart') )
// const pieChart = new PieChart( document.getElementById('piechart-1') )
//
// window.addEventListener('resize', function () {
// 	lineChart.resize()
// });

var username = window.location.href.split("?")[1];
var watcherData;
var processedData; // processed data for pie charts
var countryToCodeMap;

const ORANGE = "#ffcc00";
const LIGHT_ORANGE = "#fbe1a5";
const WHITE = "#FFFFFF";
const PINK = "#fb6090";
const LIGHT_PINK = "#f985a9";

// Fill html
$("#username").html(username);

var info = [
    {
        category: 'type',
        data: [],
    },
    {
        category: 'artistLevel',
        data: [],
    },
    {
        category: 'artistSpeciality',
        data: [],
    },
    {
        category: 'sex',
        data: [],
    },
    {
        category: 'country',
        data: [],
    },
    {
        category: 'timezone',
        data: [],
    },
]

// Load data
queue()
    .defer(d3.json, "/app/datasets/watchers.json")
    .defer(d3.csv, "/app/datasets/country_codes.csv")
    .await(ready);

function ready(error, data, rawCountryCodeData) {
    // Process raw data
    console.log(data);
    watcherData = data;
    processedData = processData();
    countryToCodeMap = processCountryCodeData(rawCountryCodeData);

    // Make Pies
    drawPies();
    makeAgeBarChart();
    drawMap();

    $("#numWatchers").html(watcherData.length);

    console.log(info);
};

// Returns a hashmap with {key: country, value: code} from raw csv data
function processCountryCodeData(data) {
    var map = {};
    data.forEach(function(d) {
        map[d.country] = d.code;
    });
    return map;
}

// Returns formatted dataset object for map
function getMapData() {
    var dataset = {};
    var unknownCount = 0;

    // Add all countries to dataset as in the format:
    // { "USA": 10, "JPN": 2 }
    watcherData.forEach(function(d) {
        if (d.country === null || d.country === "Unknown") {
            unknownCount++;
        }
        var code = countryToCodeMap[d.country];
        if (code === undefined && d.country !== null && d.country !== "Unknown") {
            console.log("Error! Undefined country " + d.country);
        } else if (code in dataset) {
            dataset[code]++;
        } else {
            dataset[code] = 1;
        }
    });

    console.log("Unknown countries: " + unknownCount);

    // create color palette function
    // color can be whatever you wish
    var maxValue = 10;
    var paletteScale = d3.scale.sqrt()
            .domain([0, maxValue])
            .range([LIGHT_ORANGE, "#fff"]);

    // Datamaps expect data in format:
    // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
    //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
    Object.keys(dataset).forEach(function(key) {
        var value = dataset[key];
        dataset[key] = { numberOfThings: value, fillColor: paletteScale(value) };
    });


    return dataset;
}


function drawMap() {

    var dataset = getMapData();

    // render map
    var map = new Datamap({
        element: document.getElementById('map'),
        projection: 'mercator', // big world map
        // countries don't listed in dataset will be painted with this color
        fills: { defaultFill: LIGHT_ORANGE },
        data: dataset,
        geographyConfig: {
            borderColor: ORANGE,
            highlightBorderColor: ORANGE,
            highlightBorderWidth: 1,
            highlightFillColor: function(d) {
                return (_.isEmpty(d) ? LIGHT_ORANGE : PINK);
            },

            // only change border

            // show desired information in tooltip
            popupTemplate: function(geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) { return ; }
                // tooltip content
                var watchers = (data.numberOfThings == 1) ? ' watcher' : ' watchers';
                return ['<div class="hover-info">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>', data.numberOfThings, watchers,
                    '</div>'].join('');
            }
        }
    });

    // Draw a legend for this map
    map.legend();
}

function drawPies() {
    info.forEach(function(d) {
        makePie(d);
    })
}



function processData() {

    // Initialize data
    var processedData = {};
    processedData['count'] = 0;

    // Loop through watcher data
    watcherData.forEach(function(watcher) {
        if (watcher['username'] == null) {
            return;
        }
        processedData['count']++;

        info.forEach(function(d) {

            if (watcher[d.category] == null) {
                // Ignore
            } else {
                var index = getIndex(watcher[d.category], d.data);
                if (index > -1) {
                    d.data[index][1]++;
                } else {
                    d.data.push([watcher[d.category], 1]);
                }
            }
        });
    });

    console.log(processedData);
    return processedData;
}

function getIndex(option, data) {
    for (var i = 0; i < data.length; i++) { // data[i] = [option, count]
        if (data[i][0] == option) {
            return i;
        }
    }
    return -1;
}

function makePie(d) {
    var chart = c3.generate({
        bindto: "#" + d.category + "Pie",
        data: {
            columns: d.data,
            type : 'pie',
        }
    });
}

function makeAgeBarChart() {
    // Generate column array for age from watcher data
    var ageData = ["Age", 0, 0, 0, 0, 0];
    var unknownCount = 0;
    watcherData.forEach(function(d) {
        if (d.age !== null) {
            var age = parseInt(d.age);
            switch(true) {
                case (age <= 14):
                    ageData[1]++;
                    break;
                case (age <= 17):
                    ageData[2]++;
                    break;
                case (age <= 22):
                    ageData[3]++;
                    break;
                case (age <= 30):
                    ageData[4]++;
                    break;
                default:
                    ageData[5]++;
                    break;
            }
        } else {
            unknownCount++;
        }
    })

    console.log("unknown Ages: " + unknownCount);

    var chart = c3.generate({
        bindto: "#ageBar",
        data: {
            columns: [ageData],
            type: 'bar'
        },
        bar: {
            width: {
                ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        },
        axis: {
            x: {
                type: 'category',
                categories: ['14 and younger', '15-17', '18-22', '23-30', '30+', 'Unknown']
            }
        }
    });
}
