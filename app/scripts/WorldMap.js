import d3 from 'd3'
import * as constants from './constants';
import Datamap from 'datamaps';

export default class WorldMap {

	constructor (watcherData, countryData) {
		this.watcherData = watcherData;
		this.countryToCodeMap = this.processCountryCodeData(countryData);
		const dataset = this.formatDataset();
		this.drawMap(dataset);

		console.log("Unknown countries: " + this.unknownCount);
	}

	// Returns a hashmap with {key: country, value: code} from raw csv data
	processCountryCodeData (data) {
	    var map = {};
	    data.forEach(function(d) {
	        map[d.country] = d.code;
	    });
	    return map;
	}

	// Returns formatted dataset object for map
	formatDataset() {
		var unknownCount = 0;
	    var dataset = {};

		const countryToCodeMap = this.countryToCodeMap;

	    // Add all countries to dataset as in the format:
	    // { "USA": 10, "JPN": 2 }
	    this.watcherData.forEach(function(d) {
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

		this.unknownCount = unknownCount;

	    // create color palette function
	    // color can be whatever you wish
	    var maxValue = 10;
	    var paletteScale = d3.scale.sqrt()
	            .domain([0, maxValue])
	            .range([constants.LIGHT_ORANGE, "#fff"]);

	    // Datamaps expect data in format:
	    // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
	    //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
	    Object.keys(dataset).forEach(function(key) {
	        var value = dataset[key];
	        dataset[key] = { numberOfThings: value, fillColor: paletteScale(value) };
	    });

	    return dataset;
	}


	drawMap (dataset) {

 		const map = new Datamap({
	        element: document.getElementById('map'),
	        projection: 'mercator',
	        fills: { defaultFill: constants.LIGHT_ORANGE },
	        data: dataset,
	        geographyConfig: {
	            borderColor: constants.ORANGE,
	            highlightBorderColor: constants.ORANGE,
	            highlightBorderWidth: 1,
	            highlightFillColor: function(d) {
	                return (_.isEmpty(d) ? constants.LIGHT_ORANGE : constants.PINK);
	            },
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
}
