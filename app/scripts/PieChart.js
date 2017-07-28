import c3 from 'c3';
import d3 from 'd3'
import * as constants from './constants';

export default class PieChart {

	constructor (category, watcherData) {
        const data = this.processData(watcherData, category);
        this.drawPie(category, data);

        console.log("unknown " + category + ": " + this.unknownCount);
    }

    drawPie(category, data) {
        var chart = c3.generate({
            bindto: "#" + category + "Pie",
            data: {
                columns: data,
                type : 'pie',
            }
        });
    }

    processData(watcherData, category) {

        var count = 0;
        var data = [];
        var getIndex = this.getIndex;

        // Loop through watcher data
        watcherData.forEach(function(watcher) {

            if (watcher[category] == null) {
                count++;
            } else {
                var index = getIndex(watcher[category], data);
                if (index > -1) {
                    data[index][1]++;
                } else {
                    data.push([watcher[category], 1]);
                }
            }
        });

        this.unknownCount = count;
        return data;
    }

    getIndex(category, data) {
        for (var i = 0; i < data.length; i++) { // data[i] = [category, count]
            if (data[i][0] == category) {
                return i;
            }
        }
        return -1;
    }

}
