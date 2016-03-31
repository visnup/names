import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { forEach, map } from 'lodash'

class Location extends Component {
  static propTypes = {
    names: PropTypes.array,
    dispatch: PropTypes.func
  }

  render() {
    return <div></div>
  }

  componentDidMount() {
    forEach(location.hash.substring(1).split('&'), (pair) => {
      let [ name, expanded ] = pair.split('=')
      if (name)
        this.props.dispatch({ type: 'add', expanded: expanded == 1, name })
    })
  }

  componentDidUpdate() {
    location.hash = map(this.props.names, (name) => {
      return `${name.name}=${name.expanded ? 1 : 0}`
    }).join('&')
  }
}

export default connect((state) => {
  return {
    names: state.names
  }
})(Location)
