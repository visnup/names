import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import d3 from 'd3'
import { sortedIndexBy, transform } from 'lodash'
import states from 'datasets-us-states-abbr-names'
import topojson from 'topojson'

import css from './map.css'

class Map extends Component {
  static propTypes = {
    counts: PropTypes.object,
    year: PropTypes.number
  }

  render() {
    return <div {...css} ref="container"></div>
  }

  componentDidMount() {
    let { width, height } = this.refs.container.getBoundingClientRect()
    let svg = d3.select(this.refs.container).append('svg')
        .attr('width', width)
        .attr('height', height)

    let projection = d3.geo.albersUsa()
        .scale(400)
        .translate([ width / 2, height / 2 ])
    let path = d3.geo.path()
        .projection(projection)

    this.color = d3.scale.linear()
        .domain([0, 100])
        .range(['white', 'red'])

    d3.json('/us-states.json', (err, us) => {
      if (err) return console.error(err)

      this.features = topojson.feature(us, us.objects.states).features
      this.states = svg.selectAll('path')
          .data(this.features)
      this.states
        .enter().append('path')
          .attr('fill', 'hsl(0, 0%, 95%)')
          .attr('d', path)
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.year !== prevProps.year) {
      let year = this.props.year
      let genders = transform(this.props.counts, (genders, counts, state) => {
        if (!state) return
        let count = counts[sortedIndexBy(counts, { year }, 'year')]
        if (count && count.year === year) {
          genders[count.gender][states[state]] = count
        }
      }, {M: {}, F: {}})
      this.states
          .attr('fill', d => {
            let count = genders.M[d.properties.name]
            return count ? this.color(count.count) : 'white'
          })
    }
  }
}

export default connect((state) => {
  return { year: state.year }
})(Map)
