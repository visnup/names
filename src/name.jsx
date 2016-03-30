import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { flatten, forEach, groupBy, isEmpty, map, omit, sumBy } from 'lodash'

import css from './name.css'
import HorizonChart from './horizon-chart'

class Name extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    showDetails: PropTypes.bool,
    extents: PropTypes.array,
    counts: PropTypes.object,
    dispatch: PropTypes.func
  }

  render() {
    let details = null
    if (this.props.showDetails) {
      details = map(omit(this.props.counts, '_all'), (counts, state) => {
        return (
          <div key={state} className="row bottom-xs detail">
            <div className="col-xs-1 end-xs">{state}</div>
            <div className="col-xs-11">
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
        <div className="row middle-xs" onClick={this.onClick}>
          <div className="col-xs-1">
            <div className="row bottom-xs">
              <div className="col-xs-2">
                <i className="material-icons">
                  {this.props.showDetails ? 'expand_less' : 'expand_more'}
                </i>
              </div>
              <div className="col-xs-10 end-xs">
                <h3>{this.props.name}</h3>
              </div>
            </div>
          </div>
          <div className="col-xs-11">
            <HorizonChart className="lg"
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
            byState._all = flatten(map(groupBy(json, 'year'), (counts, year) => {
              let byGender = groupBy(counts, 'gender')
              return map(byGender, (counts, gender) => {
                return { gender, year, count: sumBy(counts, 'count') }
              })
            }))
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

  onClick = () => {
    this.props.dispatch({ type: 'toggleDetails', name: this.props.name })
  }
}

export default connect((state, props) => {
  return {
    counts: state.countsByName[props.name] || {},
    extents: state.extents
  }
})(Name)
