import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Name from './name'

class App extends Component {
  static propTypes = {
    name: PropTypes.string,
    names: PropTypes.array,
    dispatch: PropTypes.func
  }

  render() {
    return (
      <div>
        {this.props.names.map((name) => {
          return <Name name={name} key={name} />
        })}
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            value={this.props.name}
            onChange={this.onChange}
            autoFocus />
        </form>
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
