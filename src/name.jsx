import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { flatten, groupBy, isEmpty, map, omit, sumBy } from 'lodash'

import css from './name.css'
import Horizon from './horizon'

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
        <div onClick={this.expand}>
          <Horizon className="lg"
            counts={this.props.counts && this.props.counts.null}
            extents={this.props.extents}>
            <div className="row">
              <div className="col-xs-10">
                <h3>
                  {this.props.name}
                  <i className="material-icons">
                    {this.props.expanded ? 'expand_less' : 'expand_more'}
                  </i>
                </h3>
              </div>
              <div className="col-xs-2 end-xs">
                <i className="material-icons" onClick={this.remove}>
                  delete
                </i>
              </div>
            </div>
          </Horizon>
        </div>
        {this.props.expanded &&
          map(omit(this.props.counts, 'null'), (counts, state) => {
            return (
              <div key={state}>
                <Horizon
                  counts={this.props.counts[state]}
                  extents={this.props.extents}>
                  <h6>{state}</h6>
                </Horizon>
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

export default connect()(Name)
