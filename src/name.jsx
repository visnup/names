import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { forEach, groupBy, isEmpty, map, omit, sumBy, values } from 'lodash'

import css from './name.css'
import Axis from './axis'
import HorizonChart from './horizon-chart'

class Name extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    showDetails: PropTypes.bool,
    counts: PropTypes.object,
    dispatch: PropTypes.func
  }

  render() {
    let details = null
    if (this.props.showDetails) {
      details = map(omit(this.props.counts, '_all'), (counts, state) => {
        return (
          <div key={state} className="row middle-xs">
            <div className="col-xs-1">&nbsp;{state}</div>
            <div className="col-xs-5">
              <HorizonChart
                counts={this.props.counts[state]}
                extents={this.props.extents} />
            </div>
          </div>
        )
      })
    }

    return (
      <div {...css}>
        <div className="row">
          <div className="col-xs-5 col-xs-offset-1">
            <Axis extents={this.props.extents} />
          </div>
        </div>
        <div className="row middle-xs">
          <div className="col-xs-1">{this.props.name}</div>
          <div className="col-xs-5">
            <HorizonChart
              counts={this.props.counts._all}
              extents={this.props.extents} />
          </div>
        </div>
        {details}
      </div>
    )
  }

  componentDidMount() {
    if (isEmpty(this.props.counts)) {
      this.props.dispatch((dispatch) => {
        return fetch(`/names/${this.props.name}`)
          .then(response => response.json())
          .then(json => {
            let byState = groupBy(json, 'state')
            let byYear = groupBy(json, 'year')
            forEach(byYear, (counts, year) => {
              byYear[year] = { year, count: sumBy(counts, 'count') }
            })
            byState._all = values(byYear)
            return byState
          })
          .then(grouped => {
            return dispatch({
              type: 'countsFetch',
              name: this.props.name,
              counts: grouped
            })
          })
      })
    }
  }
}

export default connect((state, props) => {
  return {
    counts: state.countsByName[props.name] || {},
    extents: state.extents
  }
})(Name)
