import React, { Component, PropTypes } from 'react'
import d3 from 'd3'

import css from './axis.css'
import margin from './margin'

class Axis extends Component {
  static propTypes = {
    extents: PropTypes.array
  }

  render() {
    return <div {...css} ref="container"></div>
  }

  componentDidMount() {
    let { width, height } = this.refs.container.getBoundingClientRect()
    let svg = d3.select(this.refs.container).append('svg')
      .attr('width', width)
      .attr('height', height)

    this.width = width - margin.left - margin.right

    this.xAxisGroup = svg.append('g')
      .classed('x axis', true)
      .attr('transform', `translate(${margin.left}, ${height-1})`)

    // TODO don't call this from here
    this.componentDidUpdate()
  }

  componentDidUpdate() {
    let x = d3.scale.linear()
      .domain(this.props.extents)
      .range([0, this.width])
    let xAxis = d3.svg.axis()
      .tickFormat(d => d)
      .orient('top')
      .scale(x)
    this.xAxisGroup.call(xAxis)
  }
}

export default Axis
