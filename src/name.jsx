import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Name extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    counts: PropTypes.array,
    dispatch: PropTypes.func
  }

  render() {
    return (
      <h1>{this.props.name}</h1>
    )
  }

  componentDidMount() {
    if (!this.props.counts) {
      this.props.dispatch((dispatch) => {
        return fetch(`/names/${this.props.name}`)
          .then(response => response.json())
          .then(json => {
            return dispatch({
              type: 'countsFetch',
              name: this.props.name,
              counts: json
            })
          })
      })
    }
  }
}

export default connect((state, props) => {
  return { counts: state.countsByName[props.name] }
})(Name)
