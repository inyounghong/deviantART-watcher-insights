import d3 from 'd3'
import dataset from '../datasets/data.json'

export default class LineChartClass {
	constructor (container) {
		this.container = container
		this.margin = {
			top: 0, 
			right: 20, 
			bottom: 20, 
			left: 20
		}
		
		this.initDimensions()
		this.initData()
		this.initScales()
		this.initAxis()

		this.svg = d3.select(this.container).append('svg')
		    .attr('width', this.width + this.margin.left + this.margin.right)
		    .attr('height', this.height + this.margin.bottom + this.margin.top)

		this.group = this.svg.append('g')

		this.xAxisGroup = this.group.append('g')
		      .attr('class', 'x axis')
		      .attr('transform', 'translate(0,' + this.height + ')')
		      .call(this.xAxis)

		this.yAxisGroup = this.group.append('g')
		      .attr('class', 'y axis')
		      .call(this.yAxis)
		    .append('text')
		      .attr('transform', 'rotate(-90)')
		      .attr('y', 6)
		      .attr('dy', '.71em')
		      .style('text-anchor', 'end')
		      .text('Price ($)')

		this.line = d3.svg.line()
			.x(function(d) { return this.x(d.date) })
	        .y(function(d) { return this.y(d.close) })
	        .bind(this)
	    
	    this.group.append('path')
			.datum(this.data)
			.attr('class', 'line')
			.attr('d', this.line)
			.attr('fill', 'none')
			.attr('stroke', 'red')
			.attr('stroke-width', 3)
	}

	initDimensions () {
		this.width = parseInt(d3.select(this.container).style('width')) - this.margin.left - this.margin.right
		this.height = (window.innerHeight * 0.6) - this.margin.bottom - this.margin.top
	}

	initData () {
		this.data = dataset
		this.formatData()
	}

	initScales () {
		this.x = d3.time.scale().range([this.margin.left, this.width])
		this.y = d3.scale.linear().range([this.height, this.margin.bottom])
		this.x.domain(d3.extent(this.data, function(d) { return d.date }))
		this.y.domain(d3.extent(this.data, function(d) { return d.close; }))
	}

	initAxis () {
		this.xAxis = d3.svg.axis().scale(this.x).orient('bottom')
		this.yAxis = d3.svg.axis().scale(this.y).orient('left')
	}

	formatData () {
		const formatDate = d3.time.format('%d-%b-%y')
		this.data.forEach( function(d) {
			d.date = formatDate.parse(d.date)
		})
	}

	updateSVG () {
		this.svg.attr('width', this.width + this.margin.left + this.margin.right)
		this.svg.attr('height', this.height + this.margin.bottom + this.margin.top)
	}

	resize () {
		this.initDimensions()
		this.updateSVG()
		this.initScales()
		this.initAxis()
		this.xAxisGroup.call(this.xAxis)
		this.yAxisGroup.call(this.yAxis)
		this.svg.selectAll('.line').attr('d', this.line)
	}

}
