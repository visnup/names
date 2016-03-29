import React, { Component, PropTypes } from 'react'
import d3 from 'd3'
import { sortBy } from 'lodash'

import css from './horizon-chart.css'
import margin from './margin'

class HorizonChart extends Component {
  static propTypes = {
    counts: PropTypes.array,
    extents: PropTypes.array
  }

  render() {
    let container = <div {...css} ref="container"></div>
    return container
  }

  componentDidMount() {
    let { width, height } = this.refs.container.getBoundingClientRect()
    let svg = d3.select(this.refs.container).append('svg')
      .attr('width', width)
      .attr('height', height)

    this.width = width - margin.left - margin.right
    this.height = height - margin.top - margin.bottom

    this.chart = svg.append('g')
      .classed('chart', true)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // TODO don't call this from here
    this.componentDidUpdate()
  }

  componentDidUpdate() {
    if (!this.props.counts) return

    let x = d3.scale.linear()
      .domain(this.props.extents)
      .range([0, this.width])

    let y = d3.scale.linear()
      .domain(d3.extent(this.props.counts, d => d.count))
      .range([this.height, 0])

    let genders = d3.nest()
      .key(d => d.gender)
      //.rollup(d => sortBy(d, 'year'))
      .entries(this.props.counts)

    let line = d3.svg.line()
      .x(d => x(d.year))
      .y(d => y(d.count))

    let genderGroups = this.chart.selectAll('g.gender').data(genders)
    genderGroups
      .enter().append('g')
        .classed('gender', true)
        .append('path')
    genderGroups.selectAll('path')
      .attr('d', d => line(d.values))
  }
}

export default HorizonChart
