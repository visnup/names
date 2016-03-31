import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import d3 from 'd3'
import { uniqueId } from 'lodash'

import css from './horizon-chart.css'
import margin from './margin'

const bands = 3

class HorizonChart extends Component {
  static propTypes = {
    className: PropTypes.string,
    counts: PropTypes.array,
    extents: PropTypes.array
  }

  render() {
    let cx = classnames(css.className, this.props.className)
    return <div className={cx} ref='container'></div>
  }

  componentDidMount() {
    let { width, height } = this.refs.container.getBoundingClientRect()
    height = height || 64 // sometimes we're mounted before we have a height
    let svg = d3.select(this.refs.container).append('svg')
        .attr('width', width)
        .attr('height', height)

    this.width = width - margin.left - margin.right
    this.height = height - margin.top - margin.bottom

    let chart = svg.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // We'll use a defs to store the area path and the clip path.
    let defs = chart.selectAll('defs').data([null])

    // The clip path is a simple rect.
    let id = uniqueId('d3_horizon_clip_')
    defs.enter().append('defs').append('clipPath')
        .attr('id', id)
      .append('rect')
        .attr('width', this.width)
        .attr('height', this.height)

    d3.transition(defs.select('rect'))
        .attr('width', this.width)
        .attr('height', this.height)

    // We'll use a container to clip all horizon layers at once.
    this.chart = chart.selectAll('g').data([null])
      .enter()
      .append('g')
        .attr('clip-path', `url(#${id})`)

    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }

  draw() {
    if (!this.props.counts || !this.props.extents.length) return

    let x = d3.scale.linear()
      .domain(this.props.extents)
      .range([0, this.width])

    let y = d3.scale.linear()
      .domain([0, d3.max(this.props.counts, d => d.count)])
      .range([this.height * bands, 0])

    let genders = d3.nest()
      .key(d => d.gender)
      .entries(this.props.counts)

    let area = d3.svg.area()
      .defined(d => d.count)
      .x(d => x(d.year))
      .y0(this.height * bands)
      .y1(d => y(d.count))

    // Instantiate each band with different transforms.
    let band = this.chart.selectAll('g.band')
      .data(d3.range(bands))
    band.enter()
      .append('g')
        .classed('band', true)
        .attr('transform', d => `translate(0, ${-this.height * d})`)

    // Draw a copy of the chart in each band.
    band.selectAll('g.gender').data(genders)
      .enter()
      .append('g')
        .attr('class', d => `gender ${d.key}`)
      .append('path')
        .attr('d', (d) => {
          // fill in undefined gaps
          let counts = [], i = 0
          for (let y = this.props.extents[0]; y <= this.props.extents[1]; y++) {
            if (d.values[i] && d.values[i].year == y) {
              counts.push(d.values[i++])
            } else {
              counts.push({ year: y })
            }
          }
          return area(counts)
        })
  }
}

export default HorizonChart
