import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { flatten, groupBy, isEmpty, map, omit, sumBy } from 'lodash'

import css from './name.css'
import HorizonChart from './horizon-chart'

class Name extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    expanded: PropTypes.bool,
    counts: PropTypes.object,

    extents: PropTypes.array,
    dispatch: PropTypes.func
  }

  render() {
    return (
      <div {...css}>
        <div className="row bottom-xs" onClick={this.expand}>
          <div className="col-xs-2">
            <div className="row middle-xs">
              <div className="col-xs-2">
                <i className="material-icons">
                  {this.props.expanded ? 'expand_less' : 'expand_more'}
                </i>
              </div>
              <div className="col-xs-2">
                <i className="material-icons" onClick={this.remove}>remove</i>
              </div>
              <div className="col-xs-8 end-xs">
                <h3>{this.props.name}</h3>
              </div>
            </div>
          </div>
          <div className="col-xs-10">
            <HorizonChart className="lg"
              counts={this.props.counts && this.props.counts._all}
              extents={this.props.extents} />
          </div>
        </div>
        {this.props.expanded &&
          map(omit(this.props.counts, '_all'), (counts, state) => {
            return (
              <div key={state} className="row middle-xs">
                <div className="col-xs-2 end-xs">
                  <h6>{state}</h6>
                </div>
                <div className="col-xs-10">
                  <HorizonChart
                    counts={this.props.counts[state]}
                    extents={this.props.extents} />
                </div>
              </div>
            )
          })
        }
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

  remove = (e) => {
    e.stopPropagation()
    this.props.dispatch({ type: 'remove', name: this.props.name })
  }
  expand = () => {
    this.props.dispatch({ type: 'expand', name: this.props.name })
  }
}

export default connect((state) => {
  return {
    extents: state.extents
  }
})(Name)
