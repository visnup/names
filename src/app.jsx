import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
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
    extents: PropTypes.array,
    brush: PropTypes.number,

    dispatch: PropTypes.func
  }

  offsetLeft = 0

  render() {
    let cx = classnames(css.className, 'container-fluid')
    let style = { left: this.props.brush + this.offsetLeft }
    return (
      <div className={cx} onMouseMove={this.brush}>
        <h5>
          First names by Birth Year (data from
            the <a href="https://www.ssa.gov/oact/babynames/limits.html">Social Security Administration</a>).

          Code on <a href="https://github.com/visnup/names">GitHub</a>.
        </h5>
        <form onSubmit={this.addName}>
          <input
            type="text"
            value={this.props.name}
            onChange={this.setName}
            placeholder="Add name"
            autoFocus />
        </form>
        <Axis ref="axis" extents={this.props.extents} brush={this.props.brush} />
        {this.props.names.map((name) => {
          return <Name {...name} extents={this.props.extents} key={name.name} />
        })}
        <div className="brush" style={style}></div>
        <Location />
      </div>
    )
  }

  componentDidMount() {
    this.offsetLeft = findDOMNode(this.refs.axis).getBoundingClientRect().left
  }

  setName = (e) => {
    this.props.dispatch({ type: 'new', name: e.target.value })
  }

  addName = (e) => {
    e.preventDefault()
    this.props.dispatch({ type: 'add', name: this.props.name })
  }

  brush = (e) => {
    this.props.dispatch({ type: 'brush', brush: e.pageX - this.offsetLeft })
  }
}

export default connect((state) => {
  return {
    name: state.newName,
    names: state.names,
    extents: state.extents,
    brush: state.brush
  }
})(App)
