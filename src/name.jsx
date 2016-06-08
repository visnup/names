import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { forEach, groupBy, isEmpty, map, omit } from 'lodash'
import states from 'datasets-us-states-abbr-names'

import css from './name.css'
import Horizon from './horizon'

class Name extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    expanded: PropTypes.bool,
    counts: PropTypes.object,

    totals: PropTypes.array,
    extents: PropTypes.array,
    year: PropTypes.number,

    dispatch: PropTypes.func
  }

  render() {
    let counts = this.props.expanded ? omit(this.props.counts, 'null') : []
    forEach(counts, (count) => {
      console.log(count)
    })
    return (
      <div {...css}>
        <div onClick={this.expand}>
          <Horizon className="lg"
                   counts={this.props.counts && this.props.counts.null}
                   extents={this.props.extents}
                   year={this.props.year}>
            <h3>
              <i className="material-icons" onClick={this.remove}>
                delete
              </i>
              <br/>
              {this.props.name}
              <i className="material-icons">
                {this.props.expanded ? 'expand_less' : 'expand_more'}
              </i>
            </h3>
          </Horizon>
        </div>
        {map(counts, (counts, state) => {
          return (
            <div key={state}>
              <Horizon counts={this.props.counts[state]}
                       extents={this.props.extents}
                       year={this.props.year}>
                <h6>{states[state] || state}</h6>
              </Horizon>
            </div>
          )
        })}
      </div>
    )
  }

  componentDidMount() {
    if (isEmpty(this.props.counts)) {
      this.props.dispatch((dispatch) => {
        return fetch(`/names/${this.props.name}`)
          .then(response => response.json())
          .then(json => groupBy(json, 'state'))
          .then(grouped => {
            return dispatch({
              type: 'countsFetch',
              name: this.props.name,
              counts: grouped
            })
          })
          .catch(e => console.error(e))
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
  return { year: state.year, totals: state.totals }
})(Name)
