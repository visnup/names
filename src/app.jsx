import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import css from './app.css'
import Location from './location'
import Axis from './axis'
import Name from './name'

class App extends Component {
  static propTypes = {
    name: PropTypes.string,
    names: PropTypes.array,
    extents: PropTypes.object,

    dispatch: PropTypes.func
  }

  render() {
    let cx = classnames(css.className, 'container-fluid')
    return (
      <div className={cx} onMouseMove={this.brush}>
        <h4>First names by year of birth</h4>
        <p>
          Charts are <a href="https://github.com/d3/d3-plugins/tree/master/horizon">horizon-like</a>: as values reach the top of
          the chart, they wrap around and get a darker shade. Colors denote
          declared genders at time of birth.

          Mouse or tap around for actual counts. Expand a chart to see
          state-by-state breakdowns.

          Data is from the <a
          href="https://www.ssa.gov/oact/babynames/limits.html">Social Security
          Administration</a>) and code is on <a href="https://github.com/visnup/names">GitHub</a>.
        </p>
        <form onSubmit={this.addName}>
          <input
            type="text"
            value={this.props.name}
            onChange={this.setName}
            placeholder="Add name"
            autoFocus />
        </form>
        <Axis ref="axis" extents={this.props.extents} />
        {this.props.names.map((name) => {
          return <Name {...name} extents={this.props.extents} key={name.name} />
        })}
        <Location />
      </div>
    )
  }

  setName = (e) => {
    this.props.dispatch({ type: 'new', name: e.target.value })
  }

  addName = (e) => {
    e.preventDefault()
    this.props.dispatch({ type: 'add', name: this.props.name })
  }
}

export default connect((state) => {
  return {
    name: state.newName,
    names: state.names,
    extents: state.extents
  }
})(App)
