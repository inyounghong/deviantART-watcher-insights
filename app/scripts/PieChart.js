import d3 from 'd3'
import dataset from '../datasets/piechart-testdata.json'

export default class PieChart {
	constructor (container) {
		this.container = container

		this.initDimensions()
		this.initColors()
		this.initGraph()

	}

	initGraph () {
		this.arc = d3.svg.arc()
		    .outerRadius(this.radius - 10)
		    .innerRadius(0)
		    .bind(this)

		this.pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) { 
		    	return d.population 
		    })

		this.svg = d3.select(this.container).append('svg')
		    .attr('width', '100%')
		    .attr('height', '100%')
		    .attr('viewBox','0 0 '+Math.min(this.width, this.height)+' '+Math.min(this.width, this.height))
		    .attr('perserveAspectRatio', 'xMinYMid')

		this.group = this.svg.append('g')
			.attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

		this.pieces = this.group.selectAll('.arc')
			.data( this.pie(dataset) )
			.enter().append('g')
				.attr('class', 'arc')

		this.pieces.append('path')
			.attr('d', this.arc)

		this.pieces.style('fill', function(d) { 
				return this.colors(d.data.age)
			}.bind(this))
	}

	initDimensions () {
		this.width = parseInt(d3.select(this.container).style('width'))
		this.height = this.width
		this.radius = Math.min(this.width, this.height) / 2
	}

	initColors () {
		this.colors = d3.scale.ordinal()
			.range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])
	}

}
