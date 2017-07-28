import c3 from 'c3';
import d3 from 'd3'
import * as constants from './constants';

export default class WorldMap {

	constructor (watcherData, countryData) {
        this.ageData = this.formatAgeData(watcherData);
        this.drawChart();

        console.log("unknown Ages: " + this.unknownCount);
    }

    formatAgeData (watcherData) {
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
        this.unknownCount = unknownCount;
        return ageData;
    }

    drawChart() {
        const categories = ['14 and younger', '15-17', '18-22', '23-30', '30+', 'Unknown'];

        var chart = c3.generate({
            bindto: "#ageBar",
            data: {
                columns: [ this.ageData ],
                type: 'bar'
            },
            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
            },
            axis: {
                x: {
                    type: 'category',
                    categories: categories,
                }
            }
        });
    }
}
