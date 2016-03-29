import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import css from './app.css'
import Name from './name'

class App extends Component {
  static propTypes = {
    name: PropTypes.string,
    names: PropTypes.array,
    dispatch: PropTypes.func
  }

  render() {
    let cx = classnames(css.className, 'container-fluid')
    return (
      <div className={cx}>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            value={this.props.name}
            onChange={this.onChange}
            placeholder="New Name"
            autoFocus />
        </form>
        {this.props.names.map((name) => {
          return <Name name={name} showDetails key={name} />
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
    name: state.name,
    names: state.names
  }
})(App)
