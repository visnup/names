import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import d3 from 'd3'
import { map, sortedIndexBy, transform, uniqueId } from 'lodash'

import css from './horizon.css'
import margin from './margin'

const bands = 3
const format = d3.format(',')

class Horizon extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.object,

    counts: PropTypes.array,
    extents: PropTypes.array,
    brush: PropTypes.number
  }

  render() {
    let cx = classnames(css.className, this.props.className)
    return (
      <div className={cx} ref='container'>
        <label>{this.props.children}</label>
      </div>
    )
  }

  componentDidMount() {
    let { width, height } = this.refs.container.getBoundingClientRect()
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

    // We'll use a container to clip all horizon layers at once.
    this.chart = chart.selectAll('g').data([null])
      .enter()
      .append('g')
        .attr('clip-path', `url(#${id})`)

    this.x = d3.scale.linear()
      .range([0, this.width])

    this.draw()

    this.count = chart.append('text')
        .classed('count', true)
        .attr('y', this.height - 10)
  }

  componentDidUpdate(prevProps) {
    if (this.props.counts !== prevProps.counts || this.props.extents !== prevProps.extents)
      this.draw()
    if (this.props.brush !== prevProps.brush)
      this.brush()
  }

  draw() {
    if (!this.props.counts || !this.props.extents.length) return

    this.x.domain(this.props.extents)

    let y = d3.scale.linear()
      .domain([0, d3.max(this.props.counts, d => d.count)])
      .range([this.height * bands, 0])

    this.genders = d3.nest()
      .key(d => d.gender)
      .entries(this.props.counts)

    let area = d3.svg.area()
      .defined(d => d.count)
      .x(d => this.x(d.year))
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
    let genderGroups = band.selectAll('g.gender').data(this.genders)
    genderGroups
      .enter()
      .append('g')
        .attr('class', d => `gender ${d.key}`)
      .append('path')
    genderGroups.selectAll('path')
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

  brush() {
    let year = Math.round(this.x.invert(this.props.brush))
    let counts = transform(this.genders, (counts, { values }) => {
      let count = values[sortedIndexBy(values, { year }, 'year')]
      if (count && count.year === year)
        counts[count.gender] = count.count
    }, {})
    this.count
        .attr('x', this.props.brush - 10)
        .text(map(counts, format).join(' '))
  }
}

export default Horizon
