import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import d3 from 'd3'
import { inRange } from 'lodash'

import css from './axis.css'
import margin from './margin'

class Axis extends Component {
  static propTypes = {
    extents: PropTypes.object,
    year: PropTypes.number,

    dispatch: PropTypes.func
  }

  render() {
    return (
      <div {...css} ref="container">
        <div className="rule" ref="rule"></div>
      </div>
    )
  }

  componentDidMount() {
    let { left, right, width, height } = this.refs.container.getBoundingClientRect()
    let svg = d3.select(this.refs.container).append('svg')
      .attr('width', width)
      .attr('height', height)

    this.x = d3.scale.linear()
      .range([0, width - margin.left - margin.right])
    this.pageX = d3.scale.linear()
      .range([ left - margin.left, right - margin.left - margin.right ])

    this.xAxisGroup = svg.append('g')
      .classed('x axis', true)
      .attr('transform', `translate(${margin.left}, ${height-0.5})`)

    this.label = svg.append('text')
        .classed('count', true)
        .attr('y', height - 9)

    window.addEventListener('mousemove', this.onMouseMove)
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove)
  }

  componentWillUpdate(props) {
    if (this.props.extents !== props.extents) {
      this.x.domain(props.extents.year)
      this.pageX.domain(props.extents.year)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.extents !== prevProps.extents)
      this.draw()

    if (this.props.extents !== prevProps.extents ||
        this.props.year !== prevProps.year)
      this.brush()
  }

  draw() {
    let xAxis = d3.svg.axis()
      .tickFormat(d => d)
      .orient('top')
      .scale(this.x)
    this.xAxisGroup.call(xAxis)
  }

  brush() {
    this.label
        .attr('x', this.x(this.props.year) - 10)
        .text(this.props.year)

    d3.select(this.refs.rule)
        .style('left', this.pageX(this.props.year) + 'px')
  }

  onMouseMove = (e) => {
    let year = Math.floor(this.pageX.invert(e.pageX))
    if (this.props.year !== year && inRange(year, this.props.extents.year[0], this.props.extents.year[1]+1))
      this.props.dispatch({ type: 'brush', year })
  }
}

export default connect((state) => {
  return { year: state.year }
})(Axis)
