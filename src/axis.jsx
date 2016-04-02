import React, { Component, PropTypes } from 'react'
import d3 from 'd3'

import css from './axis.css'
import margin from './margin'

class Axis extends Component {
  static propTypes = {
    extents: PropTypes.array,
    brush: PropTypes.number
  }

  render() {
    return <div {...css} ref="container"></div>
  }

  componentDidMount() {
    let { width, height } = this.refs.container.getBoundingClientRect()
    let svg = d3.select(this.refs.container).append('svg')
      .attr('width', width)
      .attr('height', height)

    this.x = d3.scale.linear()
      .range([0, width - margin.left - margin.right])

    this.xAxisGroup = svg.append('g')
      .classed('x axis', true)
      .attr('transform', `translate(${margin.left}, ${height-0.5})`)

    this.draw()

    this.year = svg.append('text')
        .classed('count', true)
        .attr('y', height - 10)
  }

  componentDidUpdate(prevProps) {
    if (this.props.extents !== prevProps.extents)
      this.draw()

    if (this.props.brush !== prevProps.brush)
      this.brush()
  }

  draw() {
    this.x.domain(this.props.extents)
    let xAxis = d3.svg.axis()
      .tickFormat(d => d)
      .orient('top')
      .scale(this.x)
    this.xAxisGroup.call(xAxis)
  }

  brush() {
    let year = Math.round(this.x.invert(this.props.brush))
    this.year
        .attr('x', this.props.brush - 10)
        .text(year)
  }
}

export default Axis
