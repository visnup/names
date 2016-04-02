import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { forEach, map } from 'lodash'

class Location extends Component {
  static propTypes = {
    names: PropTypes.array,
    dispatch: PropTypes.func
  }

  render() {
    return null
  }

  componentDidMount() {
    forEach(location.hash.substring(1).split(',').reverse(), (pair) => {
      let [ name, expanded ] = pair.split('~')
      if (name)
        this.props.dispatch({ type: 'add', expanded: expanded == '', name })
    })
  }

  componentDidUpdate() {
    location.hash = map(this.props.names, (name) => {
      return name.expanded ? `${name.name}~`: name.name
    }).join(',')
  }
}

export default connect((state) => {
  return {
    names: state.names
  }
})(Location)
