import * as constants from './constants';
import LineChart from './LineChart';
import WorldMap from './WorldMap';
import AgeChart from './AgeChart';
import PieChart from './PieChart';
import $ from 'jquery';
import _ from 'lodash';
import c3 from 'c3';
import { json } from 'd3-request';
import { queue } from 'd3-queue';

export default class Visualization {

    constructor() {
        // Load data
        queue()
            .defer(d3.json, "/app/datasets/watchers.json")
            .defer(d3.csv, "/app/datasets/country_codes.csv")
            .await(this.ready);
    }

    ready(error, watcherData, rawCountryCodeData) {
        console.log(watcherData);

        const ageChart = new AgeChart(watcherData);
        const worldMap = new WorldMap(watcherData, rawCountryCodeData);

        // Draw Pies
        const pies = ['type', 'artistLievel', 'artistSpecialty', 'sex', 'country'];
        pies.forEach(function(category) {
            new PieChart(category, watcherData);
        });

        $("#numWatchers").html(watcherData.length);
    };
}
