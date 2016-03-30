import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import css from './app.css'
import Axis from './axis'
import Name from './name'

class App extends Component {
  static propTypes = {
    name: PropTypes.string,
    names: PropTypes.array,
    extents: PropTypes.array,
    dispatch: PropTypes.func
  }

  render() {
    let cx = classnames(css.className, 'container-fluid')
    return (
      <div className={cx}>
        <h4>First names by Birth Year</h4>
        <div className="row">
          <div className="col-xs-1">
            <form onSubmit={this.onSubmit}>
              <input
                type="text"
                value={this.props.name}
                onChange={this.onChange}
                placeholder="New name"
                autoFocus />
            </form>
          </div>
          <div className="col-xs-11">
            <Axis extents={this.props.extents} />
          </div>
        </div>
        {this.props.names.map((name) => {
          return <Name {...name} key={name.name} />
        })}
      </div>
    )
  }

  onChange = (e) => {
    this.props.dispatch({ type: 'new', name: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.dispatch({ type: 'add', name: this.props.name })
  }
}

export default connect((state) => {
  return {
    extents: state.extents,
    name: state.newName,
    names: state.names
  }
})(App)
