import * as constants from './scripts/constants';
import PieChart from './scripts/PieChart';
import LineChart from './scripts/LineChart';
import WorldMap from './scripts/WorldMap';
import AgeChart from './scripts/AgeChart';
import $ from 'jquery';
import _ from 'lodash';
import c3 from 'c3';
import d3 from 'd3';

import { queue } from 'd3-queue';


import 'normalize.css/normalize.css';
import 'c3/c3.min.css';
import './stylesheets/main.scss';

// const testClass = new TestClass();
// const lineChart = new LineChart( document.getElementById('linechart') )
// const pieChart = new PieChart( document.getElementById('piechart-1') )
//
// window.addEventListener('resize', function () {
// 	lineChart.resize()
// });

var username = window.location.href.split("?")[1];
var watcherData;
var processedData; // processed data for pie charts


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


    // Make Pies
    drawPies();

    const ageChart = new AgeChart(watcherData);
    const worldMap = new WorldMap(data, rawCountryCodeData);

    $("#numWatchers").html(watcherData.length);

    console.log(info);
};




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
